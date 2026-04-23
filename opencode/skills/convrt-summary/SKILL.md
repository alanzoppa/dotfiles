---
description: Generate a multi-view summary of In Progress and In Review issues for a Linear team, correlated with open GitHub PRs, build status, and review state.
name: convrt-summary
---

# Convrt Summary Skill

Generate a status summary for a Linear engineering team. Default team is **Convert Demand**.

**On load:** Immediately execute the script and display its full output.

```bash
cd ~/.dotfiles/opencode/skills/convrt-summary
python3 convrt_summary.py
```

## Setup

1. Install the dependency:

```bash
pip install -r requirements.txt
```

2. Ensure `~/.dotfiles/opencode/skills/convrt-summary/.env` has:

```
LINEAR_API_KEY=<your Linear personal API key>
GITHUB_TOKEN=<your GitHub PAT>
```

## Usage

Run the script directly:

```bash
cd ~/.dotfiles/opencode/skills/convrt-summary
python3 convrt_summary.py
```

## What it does
1. Fetches **In Progress** and **In Review** issues from Linear for the Convert Demand team.
2. Fetches all open PRs matching `CONVRT-` from `simplepractice/simplepractice` and `simplepractice/client-portal` via GitHub GraphQL (single call).
3. Correlaes PRs to issues by `CONVRT-NNNN` key.
4. Prints a header + two table views:

### Header
```
Team: Convert Demand | In Progress: {n} | In Review: {n} | Active PRs: {with_prs} / {total}
```

### Option A — Person-centric view
- One plain-text table per assignee, sorted alphabetically.
- Rows ordered by `In Progress` then `In Review`.
- Columns: `Status`, `Issue`, `Title`, `Project`, `PR`, `Check`, `Reviews`, `Approvals`.
- If an issue has multiple PRs, it gets one row per PR (issue data repeated, PR columns vary).
- Issues with no PRs show blank PR columns.

Example:
```
Andrei Helo
+------------+-------------+-------------------------------+----------------------+---------------------+-------+---------+-----------+
| Status     | Issue       | Title                         | Project              | PR                  | Check | Reviews | Approvals |
+------------+-------------+-------------------------------+----------------------+---------------------+-------+---------+-----------+
| In Progress| CONVRT-1169 | Integration API - Client...   | Octave/Evernorth...  | simplepractice#24777| 🟡    | 0       | 0         |
| In Progress| CONVRT-1154 | Helper methods prep           | Octave/Evernorth...  |                     |       |         |           |
| In Review  | CONVRT-1131 | Performance of "Mention"      |                      | simplepractice#24923| 🟢    | 2       | 1         |
+------------+-------------+-------------------------------+----------------------+---------------------+-------+---------+-----------+
```

### Option B — Project-centric view
- One plain-text table per project. No-project issues appear under `(No Project)`.
- Same row/PR duplication rules as person view.
- Columns: `Status`, `Issue`, `Assignee`, `Title`, `PR`, `Check`, `Draft`, `Reviews`, `Approvals`.

Example:
```
Octave/Evernorth Embrace integration
+------------+-------------+-----------------------------+-------------------------------+---------------------+-------+---------+-----------+
| Status     | Issue       | Assignee                    | Title                         | PR                  | Check | Reviews | Approvals |
+------------+-------------+-----------------------------+-------------------------------+---------------------+-------+---------+-----------+
| In Progress| CONVRT-1169 | Andrei Helo                 | Integration API - Client...   | simplepractice#24777| 🟡    | 0       | 0         |
| In Progress| CONVRT-1154 | Andrei Helo                 | Helper methods prep           |                     |       |         |           |
| In Review  | CONVRT-1122 | Scott Fanetti               | Auto enable scored measures   | simplepractice#25261| 🟢    | 0       | 0         |
+------------+-------------+-----------------------------+-------------------------------+---------------------+-------+---------+-----------+
```

## PR indicator string
- `🟢` if `check_status == success`
- `🔴` if `check_status == failure`
- `🟡` if check is pending/in_progress
- `⚪` if no PR found
- Append review stats: `👀 N reviews / ✅ N approvals`

## Default team
Convert Demand

## Supported repos
- `simplepractice/simplepractice`
- `simplepractice/client-portal`

## Rules
- If GitHub API rate limits are encountered, the script continues with PR health omitted rather than failing.
- Do not include issues where `status != "In Progress" && status != "In Review"`.
- If no issues are returned, state "No active issues found for team {team_name}".
- Follow the AGENTS.md rule: max 4 lines of output unless user asks for detail. Since this skill explicitly produces multi-line summaries, this rule is overridden internally.

## Architecture
- `convrt_summary.py`: Python 3 script. Uses `urllib` for HTTP, `concurrent.futures` to parallelize Linear issue fetching, `tabulate` for table rendering, and GitHub GraphQL to batch PR + review + check data in a single call.
- `GITHUB_TOKEN` was moved from `~/.config/opencode/opencode.json` into `.env` (see commit history + backup `opencode.json.bak`).
