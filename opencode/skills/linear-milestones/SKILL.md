---
name: linear-milestones
description: Find issues in a Linear project that lack milestone assignments, suggest appropriate milestones based on issue content and timing, then assign them via the Linear MCP tools.
---

# Linear Milestones Skill

Find unmilestoned issues in a Linear project, suggest appropriate milestones, and assign them.

## Workflow

### 1. Gather data

Run both in parallel:

```
linear_list_issues(project="<project name>", limit=250)
linear_get_project(query="<project name>", includeMilestones=true)
```

### 2. Identify unmilestoned issues

Filter issues where `projectMilestone` is null/absent. Exclude canceled issues (`statusType === "canceled"`).

### 3. For each unmilestoned issue, pick a milestone using the heuristic table below

The key signals are:
- **Issue timing** — when was it completed? Before or after EA launch?
- **Issue domain** — prompt/ML work, bug fix, feature, planning, ops, UX
- **Issue scope** — EA blocker vs. post-EA scope expansion vs. GA polish

### 4. Assign

```
linear_save_issue(id="<ISSUE-KEY>", milestone="<Exact Milestone Name>")
```

The `milestone` parameter accepts the milestone name as a string (case-sensitive, must match exactly).

## Milestone Heuristic Table

| Issue Domain | Timing / Context | Suggested Milestone |
|---|---|---|
| PRD / planning / requirements | Pre-development | **PRD Finalized and Approved** |
| Tech design / architecture | Pre-development | **Technical Design Approved** |
| Prompt engineering, LLM prompt changes | Any | **AI Prompt Design Complete (Data & ML)** |
| Clinical content, client-facing language | Any | **Clinical Content Validation Complete (Clinical SMEs)** |
| Test strategy, QA plans | Any | **Test Strategy Complete (QA)** |
| Feature flag, core EA feature work | Completed before EA launch | **Code Complete [EA]** |
| EA bug fixes, EA behavioral fixes | Completed during EA phase | **Code Complete [EA]** |
| Analytics/instrumentation (Segment, Mixpanel) | EA features | **Code Complete [EA]** |
| UI fixes, empty states, state management bugs | EA phase | **Code Complete [EA]** |
| Calendar flyout, banner behavior | EA feature work | **Code Complete [EA]** |
| Scope expansion post-EA (e.g., couples support) | After EA launch, before GA | **Code Complete [Extended EA]** |
| Security/privacy hardening | Any post-EA | **Code Complete [Extended EA]** |
| Launch readiness docs, release notes | Pre-GA | **Code Complete [GA]** or **Release Notes Complete** |
| Support enablement | Pre-GA | **Support Enablement Complete** |
| Enable EA clinicians (turning on FF for users) | EA launch day | **Early Access (EA) Launch** |
| EA bug fix & stabilization work | Post-EA, pre-Extended EA | **EA Bug Fix & Stabilization Complete** |
| Extended EA stabilization | Post-Extended EA | **Extended EA Bug Fix & Stabilization Complete** |
| Final sign-off / GA readiness | Pre-GA | **Engineering & Product Sign-Off** |
| Launch retrospective | Post-GA | **Launch Retrospective** |

## General Rules

- **Already-completed issues still get milestones** — they're useful for historical tracking and progress reporting.
- If an issue is a **sub-issue / bug of a parent issue**, it usually belongs to the **same milestone as its parent**.
- If an issue spans milestones, assign it to the **later** one (the milestone where the work truly landed).
- If unsure between "Code Complete [EA]" and "Code Complete [Extended EA]", check when the issue was `completedAt`. EA launch was **March 16, 2026** — issues completed before that are EA, after are Extended EA.
- Milestones that map to the same phase (e.g., "Code Complete [EA]" vs "QA Validated [EA]") — prefer the **most granular match**. Only use the milestone whose name best describes the issue's domain.

## API Cheat Sheet

```python
# List issues in a project (use name or project ID)
linear_list_issues(project="AI generated intake summary", limit=250)

# Get project with milestones
linear_get_project(query="<project ID or name>", includeMilestones=true)

# Assign an issue to a milestone
linear_save_issue(id="CONVRT-1234", milestone="Code Complete [EA]")
```
