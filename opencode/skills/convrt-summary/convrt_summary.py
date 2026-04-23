#!/usr/bin/env python3
"""
Convrt Summary — self-contained Python 3 (stdlib only).

Fetches In Progress + In Review issues for the Convert Demand Linear team,
correlates open GitHub PRs, and prints person-centric + project-centric views.

Usage:
    cd ~/.dotfiles/opencode/skills/convrt-summary
    python3 convrt_summary.py

Depends on:
    - Python 3.7+
    - LINEAR_API_KEY in .env
    - GITHUB_TOKEN  in .env
"""

import concurrent.futures
import json
import os
import re
import sys
import urllib.request
from collections import defaultdict
from pathlib import Path

LINEAR_API_URL = "https://api.linear.app/graphql"
GITHUB_API_URL = "https://api.github.com/graphql"
DEFAULT_TEAM = "Convert Demand"


def load_dotenv():
    """Load KEY=VAL pairs from .env file in the same directory as this script."""
    env_path = Path(__file__).parent / ".env"
    if not env_path.exists():
        print("Error: .env not found.", file=sys.stderr)
        sys.exit(1)
    with env_path.open() as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if "=" in line:
                key, val = line.split("=", 1)
                os.environ.setdefault(key.strip(), val.strip())


def linear_graphql(query, variables=None):
    """Call Linear GraphQL API."""
    token = os.environ["LINEAR_API_KEY"]
    payload = json.dumps({"query": query, "variables": variables or {}}).encode()
    req = urllib.request.Request(
        LINEAR_API_URL,
        data=payload,
        headers={"Content-Type": "application/json", "Authorization": token},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read())


def github_graphql(query, variables=None):
    """Call GitHub GraphQL API."""
    token = os.environ["GITHUB_TOKEN"]
    payload = json.dumps({"query": query, "variables": variables or {}}).encode()
    req = urllib.request.Request(
        GITHUB_API_URL,
        data=payload,
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {token}"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read())


def get_team_id(team_name):
    """Resolve Linear team name to id."""
    q = "query Teams { teams(filter: {name: {eq: $name}}) { nodes { id name } } }"
    q = q.replace("$name", json.dumps(team_name))
    data = linear_graphql(q)
    nodes = data["data"]["teams"]["nodes"]
    if not nodes:
        print(f"Team '{team_name}' not found.", file=sys.stderr)
        sys.exit(1)
    return nodes[0]["id"]


def get_issues(team_id, state_name):
    """Fetch issues for a team in a given state."""
    issue_list = []
    cursor = None
    while True:
        q = """query Issues($teamId: ID!, $stateName: String!, $cursor: String) {
            issues(
                filter: { team: { id: { eq: $teamId } } state: { name: { eq: $stateName } } }
                first: 100  after: $cursor
            ) {
                nodes {
                    id identifier title
                    assignee { id name }
                    project { id name }
                    priority estimate
                    labels { nodes { id name } }
                    branchName
                    state { name }
                }
                pageInfo { hasNextPage endCursor }
            }
        }"""
        variables = {"teamId": team_id, "stateName": state_name, "cursor": cursor}
        data = linear_graphql(q, variables)
        nodes = data["data"]["issues"]["nodes"]
        page_info = data["data"]["issues"]["pageInfo"]
        issue_list.extend(nodes)
        if not page_info.get("hasNextPage"):
            break
        cursor = page_info["endCursor"]
    return issue_list


def fetch_github_prs():
    """Fetch open PRs with CONVRT- from both repos in a single GraphQL call."""
    q = """
    {
      search(query: "is:open repo:simplepractice/simplepractice repo:simplepractice/client-portal CONVRT- in:title", type: ISSUE, first: 100) {
        nodes {
          ... on PullRequest {
            number
            title
            url
            isDraft
            reviews(first: 100) { totalCount nodes { state } }
            commits(last: 1) {
              nodes { commit { statusCheckRollup { state } } }
            }
            repository { name owner { login } }
          }
        }
      }
    }
    """
    data = github_graphql(q)
    prs = []
    for node in data["data"]["search"]["nodes"]:
        check_state = None
        commits_nodes = node["commits"]["nodes"]
        if commits_nodes:
            commit = commits_nodes[0]["commit"]
            rollup = commit.get("statusCheckRollup")
            if rollup:
                check_state = rollup["state"]

        reviews = node["reviews"]["nodes"]
        approved = sum(1 for r in reviews if r["state"] == "APPROVED")

        repo_full = f"{node['repository']['owner']['login']}/{node['repository']['name']}"

        prs.append({
            "repo": repo_full,
            "number": node["number"],
            "title": node["title"],
            "draft": node["isDraft"],
            "check_status": check_state or "unknown",
            "reviews_total": node["reviews"]["totalCount"],
            "reviews_approved": approved,
        })
    return prs


def get_priority_abbrev(priority_name):
    mapping = {"Urgent": "[P]", "High": "[H]", "Medium": "[M]", "Low": "[L]"}
    return mapping.get(priority_name, "[ ]")


def get_check_emoji(check_status):
    status = str(check_status).lower()
    return {"success": "🟢", "failure": "🔴", "pending": "🟡", "in_progress": "🟡"}.get(status, "⚪")


def build_pr_indicator(pr):
    parts = [f"{pr['repo']}#{pr['number']}", get_check_emoji(pr["check_status"])]
    if pr.get("draft"):
        parts.append("(draft)")
    total = pr["reviews_total"]
    approved = pr["reviews_approved"]
    approval_word = "approval" if approved == 1 else "approvals"
    parts.append(f"👀 {total} reviews / ✅ {approved} {approval_word}")
    return " ".join(parts)


def extract_issue_key(title):
    match = re.search(r"(CONVRT-\d+)", title)
    return match.group(1) if match else None


def get_priority_label_from_value(value):
    mapping = {0: "Urgent", 1: "High", 2: "Medium", 3: "Low"}
    return mapping.get(value, "")


def main():
    load_dotenv()
    team_name = DEFAULT_TEAM

    team_id = get_team_id(team_name)

    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
        ip = pool.submit(get_issues, team_id, "In Progress")
        ir = pool.submit(get_issues, team_id, "In Review")
        in_progress = ip.result()
        in_review = ir.result()

    all_issues = in_progress + in_review

    if not all_issues:
        print(f"No active issues found for team {team_name}")
        sys.exit(0)

    prs = fetch_github_prs()

    issues_by_key = {}
    for issue in all_issues:
        key = issue["identifier"]
        issues_by_key[key] = issue
        issue["prs"] = []

    for pr in prs:
        key = extract_issue_key(pr["title"])
        if key and key in issues_by_key:
            issues_by_key[key]["prs"].append(pr)

    total = len(all_issues)
    with_prs = sum(1 for i in all_issues if i["prs"])
    header = f"Team: {team_name} | In Progress: {len(in_progress)} | In Review: {len(in_review)} | Active PRs: {with_prs}/{total}"
    lines = [header, ""]

    by_person = defaultdict(list)
    for issue in all_issues:
        assignee_name = (issue.get("assignee") or {}).get("name") or "(Unassigned)"
        by_person[assignee_name].append(issue)

    lines.append("=== Person-centric View ===")
    for person in sorted(by_person.keys()):
        lines.append(f"\n{person}")
        issues = sorted(by_person[person], key=lambda i: (i["state"]["name"] != "In Progress", i["identifier"]))
        grouped = defaultdict(list)
        for issue in issues:
            grouped[issue["state"]["name"]].append(issue)
        for status in ["In Progress", "In Review"]:
            if status in grouped:
                lines.append(f"  {status} ({len(grouped[status])})")
                for issue in grouped[status]:
                    ident = issue["identifier"]
                    title = issue["title"]
                    priority_label = issue.get("priorityLabel") or get_priority_label_from_value(issue.get("priority"))
                    priority = get_priority_abbrev(priority_label)
                    estimate = issue.get("estimate")
                    estimate_str = f" ({estimate} Points)" if estimate else ""
                    project = (issue.get("project") or {}).get("name")
                    project_str = f" | {project}" if project else ""
                    lines.append(f"    {priority} {ident} --- {title}{estimate_str}{project_str}")
                    for pr in issue.get("prs", []):
                        lines.append(f"      {build_pr_indicator(pr)}")

    by_project = defaultdict(list)
    for issue in all_issues:
        project_name = (issue.get("project") or {}).get("name") or "(No Project)"
        by_project[project_name].append(issue)

    lines.append("\n\n=== Project-centric View ===")
    for project in sorted(by_project.keys()):
        lines.append(f"\n{project}")
        issues = sorted(by_project[project], key=lambda i: (i["state"]["name"] != "In Progress", i["identifier"]))
        grouped = defaultdict(list)
        for issue in issues:
            grouped[issue["state"]["name"]].append(issue)
        for status in ["In Progress", "In Review"]:
            if status in grouped:
                lines.append(f"  {status} ({len(grouped[status])})")
                for issue in grouped[status]:
                    ident = issue["identifier"]
                    assignee = (issue.get("assignee") or {}).get("name") or "(Unassigned)"
                    title = issue["title"]
                    priority_label = issue.get("priorityLabel") or get_priority_label_from_value(issue.get("priority"))
                    priority = get_priority_abbrev(priority_label)
                    pr_strs = [build_pr_indicator(pr) for pr in issue.get("prs", [])]
                    pr_part = "  ".join(pr_strs) if pr_strs else ""
                    lines.append(f"    {priority} {ident} --- {assignee} --- {title}{('  ' + pr_part) if pr_part else ''}")
            else:
                lines.append("")

    print("\n".join(lines))


if __name__ == "__main__":
    main()
