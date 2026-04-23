---
description: Generate a multi-view summary of In Progress and In Review issues for a Linear team, correlated with open GitHub PRs, build status, and review state.
name: convrt-summary
---

# Convrt Summary Skill

Generate a status summary for a Linear engineering team. Default team is **Convert Demand**.

## Workflow

1. **Determine the team name**
   - Parse from user request if provided (e.g. "summarize Team Alpha").
   - Default: `Convert Demand` if not specified or ambiguous.

2. **Fetch Linear issues**
   - Use `linear_list_issues` twice:
     - `state: "In Progress"`
     - `state: "In Review"`
   - Pass same `team` and `limit: 100`.
   - Collect for each issue:
     - `id` (e.g. `CONVRT-1166`)
     - `title`
     - `assignee.name`
     - `project.name` (may be `null`)
     - `priority.name` (Urgent/High/Medium/Low)
     - `estimate.name`
     - `labels` (array of strings)
     - `gitBranchName` (may be `null`)
     - `status` state name

3. **Batch-fetch GitHub PRs**
   - Call `github_search_pull_requests` with:
     - `owner: "simplepractice"`, `query: "is:open CONVRT- in:title"`, `perPage: 100`
   - This returns all open PRs across all `simplepractice` repos for the user.
   - Filter to only repos:
     - `simplepractice`
     - `client-portal`
   - Map each PR to an issue key by extracting `CONVRT-\d+` from the PR title.

4. **Enrich PRs with review + check state**
   - For each matched PR, call:
     - `github_pull_request_read` with `method: get`
     - `github_pull_request_read` with `method: get_status`
     - `github_pull_request_read` with `method: get_reviews`
   - Annotate each PR with:
     - `state`: open/closed
     - `draft`: true/false
     - `check_status`: combined commit status (`success`, `failure`, `pending`, `in_progress`)
     - `reviews.total`: count of submitted reviews
     - `reviews.approved`: count of approvals
   - **Cache results** for the remainder of the skill invocation to avoid re-querying the same PR.

5. **Correlate and build output**
   - Each issue may have zero, one, or two PRs (one per repo).
   - Build a PR indicator string per issue:
     - `🟢` if `check_status == success`
     - `🔴` if `check_status == failure`
     - `🟡` if check is pending/in_progress
     - `⚪` if no PR found
     - Append draft marker ` (draft)` if `draft == true`
     - Append review stats: `👀 N reviews / ✅ N approvals`
   - Example: `simplepractice#25261 🟢 (draft) 👀 2 reviews / ✅ 1 approval`

6. **Print Option A — Person-centric view**
   - Group issues by `assignee.name`, sorted alphabetically.
   - Within each person, group by `status` (`In Progress`, then `In Review`).
   - Per issue line:
     - `[P] CONVRT-XXXX — Title`  (`[H]`, `[M]`, `[L]` for priority)
     - If PRs exist, indent and print the PR indicator string
     - If estimate exists, append it in parens: `(2 Points)`
     - If `project`, append: `| Project Name`

   Example output block:

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

7. **Print Option B — Project-centric view**
   - Group issues by `project.name`. Issues with no project go under `(No Project)`.
   - Within each project, group by status.
   - Per issue line:
     - `[H] CONVRT-XXXX — Assignee — Title` (PR states inline)
     - Example: `[H] CONVRT-1169 — Andrei Helo — Integration API... simplepractice#24777 🟡`

   Example output block:

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

8. **Header**
   - Print a one-line header at the top:
     - `Team: {team_name} | In Progress: {n} | In Review: {n} | Active PRs: {with_prs} / {total_issues}`

## Default team
Convert Demand

## Supported repos
- `simplepractice/simplepractice`
- `simplepractice/client-portal`

## Rules
- If GitHub API rate limits or errors are encountered, continue with the PR health omitted rather than failing the entire summary.
- Do not include issues where `status != "In Progress" && status != "In Review"`.
- If no issues are returned, state "No active issues found for team {team_name}".
- Follow the AGENTS.md rule: max 4 lines of output unless user asks for detail. Since this skill explicitly produces multi-line summaries, this rule is overridden internally.
