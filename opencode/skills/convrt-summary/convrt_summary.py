#!/usr/bin/env python3
"""
Convrt Summary — self-contained Python 3 (stdlib only).

Fetches In Progress + In Review issues for the Convert Demand Linear team,
correlates open GitHub PRs, and prints person-centric + project-centric tables.

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
import textwrap
import urllib.request
from collections import defaultdict
from pathlib import Path

from tabulate import tabulate

LINEAR_API_URL = "https://api.linear.app/graphql"
GITHUB_API_URL = "https://api.github.com/graphql"
DEFAULT_TEAM = "Convert Demand"
ISSUE_PREFIX = "CONVRT"

PERSON_HEADERS = ["Status", "Issue", "Title", "Project", "PR", "Check", "Reviews", "Approvals"]
PROJECT_HEADERS = ["Status", "Issue", "Assignee", "Title", "PR", "Check", "Reviews", "Approvals"]


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
    """Fetch open PRs with {ISSUE_PREFIX}- from both repos in a single GraphQL call."""
    q = f"""
    {{
      search(query: "is:open repo:simplepractice/simplepractice repo:simplepractice/client-portal {ISSUE_PREFIX}- in:title", type: ISSUE, first: 100) {{
        nodes {{
          ... on PullRequest {{
            number
            title
            url
            isDraft
            reviews(first: 100) {{ totalCount nodes {{ state }} }}
            commits(last: 1) {{
              nodes {{ commit {{ statusCheckRollup {{ state }} }} }}
            }}
            repository {{ name owner {{ login }} }}
          }}
        }}
      }}
    }}
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


def get_check_emoji(check_status):
    status = str(check_status).lower()
    return {"success": "🟢", "failure": "🔴", "pending": "🟡", "in_progress": "🟡"}.get(status, "⚪")


def extract_issue_key(title):
    match = re.search(rf"({ISSUE_PREFIX}-\d+)", title)
    return match.group(1) if match else None


def short_repo(repo):
    if repo == "simplepractice/simplepractice":
        return "sp"
    if repo == "simplepractice/client-portal":
        return "cp"
    return repo.split("/")[-1]


def truncate(text, width=22):
    return textwrap.shorten(str(text or ""), width=width, placeholder="...")


def first_name(text):
    return str(text or "").split()[0] if text else ""


def issue_table_rows(issue, headers, extra_col_name, extra_col_value):
    prs = issue.get("prs", [])

    def base_dict():
        extra = first_name(extra_col_value) if extra_col_name == "Assignee" else truncate(extra_col_value, 24)
        return {
            "Status": issue["state"]["name"],
            "Issue": issue["identifier"],
            "Title": truncate(issue["title"], 60),
            "PR": "",
            "Check": "",
            "Reviews": "",
            "Approvals": "",
            extra_col_name: extra,
        }

    if not prs:
        d = base_dict()
        return [[d.get(h, "") for h in headers]]

    rows = []
    for pr in prs:
        d = base_dict()
        d["PR"] = f"{short_repo(pr['repo'])}#{pr['number']}"
        d["Check"] = get_check_emoji(pr["check_status"])
        d["Reviews"] = str(pr["reviews_total"])
        d["Approvals"] = str(pr["reviews_approved"])
        rows.append([d.get(h, "") for h in headers])
    return rows


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

    try:
        prs = fetch_github_prs()
    except Exception as e:
        print(f"Warning: GitHub PR fetch failed ({e}), continuing without PR data.", file=sys.stderr)
        prs = []

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
        rows = []
        for issue in issues:
            project_name = (issue.get("project") or {}).get("name") or ""
            rows.extend(issue_table_rows(issue, PERSON_HEADERS, "Project", project_name))
        lines.append(tabulate(rows, headers=PERSON_HEADERS, tablefmt="grid", stralign="left"))

    by_project = defaultdict(list)
    for issue in all_issues:
        project_name = (issue.get("project") or {}).get("name") or "(No Project)"
        by_project[project_name].append(issue)

    lines.append("\n\n=== Project-centric View ===")
    for project_name in sorted(by_project.keys()):
        lines.append(f"\n{project_name}")
        issues = sorted(by_project[project_name], key=lambda i: (i["state"]["name"] != "In Progress", i["identifier"]))
        rows = []
        for issue in issues:
            assignee = (issue.get("assignee") or {}).get("name") or ""
            rows.extend(issue_table_rows(issue, PROJECT_HEADERS, "Assignee", assignee))
        lines.append(tabulate(rows, headers=PROJECT_HEADERS, tablefmt="grid", stralign="left"))

    print("\n".join(lines))


if __name__ == "__main__":
    main()
