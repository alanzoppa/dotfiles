---
description: Generate a multi-view summary of In Progress and In Review issues for a Linear team, correlated with open GitHub PRs, build status, and review state.
name: convrt-summary
---

# Convrt Summary Skill

Generate a status summary for a Linear engineering team. Default team is **Convert Demand**.

## Setup

Ensure `~/.dotfiles/opencode/skills/convrt-summary/.env` has:

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
4. Prints a header + two views:

### Header
```
Team: Convert Demand | In Progress: {n} | In Review: {n} | Active PRs: {with_prs} / {total}
```

### Option A — Person-centric view
- Groups issues by `assignee.name`, sorted alphabetically.
- Within each person, groups by status (`In Progress`, then `In Review`).
- Per issue:
  - `[H] CONVRT-XXXX — Title`
  - If PRs exist, indented PR indicator string.
  - If estimate exists: `(2 Points)`
  - If project exists: `| Project Name`

Example:
```
Andrei Helo
  In Progress (2)
    [H] CONVRT-1169 — Integration API — Client GlobalMonarchChannels one-to-many migration
      simplepractice#24777 🟡 (draft) 👀 0 reviews / ✅ 0 approvals
    [H] CONVRT-1154 — Integration API — Helper methods prep
  In Review (1)
    [M] CONVRT-1131 — Performance of the "Mention" feature
      simplepractice#24923 🟢 👀 2 reviews / ✅ 1 approval
```

### Option B — Project-centric view
- Groups issues by `project.name`. No-project issues under `(No Project)`.
- Within each project, groups by status.
- Per issue: `[H] CONVRT-XXXX — Assignee — Title` (PR states inline)

Example:
```
Octave/Evernorth Embrace integration
  In Progress (3)
    [H] CONVRT-1169 — Andrei Helo — Integration API — Client GlobalMonarchChannels one-to-many migration
      simplepractice#24777 🟡 (draft) 👀 0 reviews / ✅ 0 approvals
    [H] CONVRT-1154 — Andrei Helo — Integration API — Helper methods prep
    [M] CONVRT-1164 — Scott Fanetti — Auto enable scored measures for above threshold scores for Octave transfer clients
      simplepractice#25261 🟢 (draft) 👀 0 reviews / ✅ 0 approvals
  In Review (2)
    [M] CONVRT-1152 — Arturo Gonzalez — Evernorth rate expiration badge and tooltip on progress note
    [H] CONVRT-1113 — Scott Fanetti — Auto-enable scored measures for Cigna members
```

## PR indicator string
- `🟢` if `check_status == success`
- `🔴` if `check_status == failure`
- `🟡` if check is pending/in_progress
- `⚪` if no PR found
- Append draft marker ` (draft)` if `draft == true`
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
- `convrt_summary.py`: stdlib-only Python 3 script. Uses `urllib` for HTTP, `concurrent.futures` to parallelize Linear issue fetching, and GitHub GraphQL to batch PR + review + check data in a single call.
- `GITHUB_TOKEN` was moved from `~/.config/opencode/opencode.json` into `.env` (see commit history + backup `opencode.json.bak`).
