---
name: add-zoom-note
description: Format a raw Zoom AI meeting summary into a properly structured markdown note and add it to the notes-browser corpus at ~/dev/notes-browser/notes/, then verify the watcher picked it up.
---

# Add Zoom Note

Use this skill when the user pastes a raw Zoom AI Companion meeting summary and wants it formatted and filed into the notes corpus.

The notes live at `~/dev/notes-browser/notes/` and are watched by a FastAPI backend that auto-ingests them into ChromaDB with embeddings (Ollama `nomic-embed-text-v2-moe`). After dropping the file you **must** verify ingestion.

---

## Workflow

1. **Parse** the Zoom paste: extract meeting title, date/time, participants, and topic blocks. Convert relative dates ("yesterday", "Tuesday") to absolute using today's date from the environment context.

2. **Look up the calendar event** to get the exact start time, confirm the title, and grab the `htmlLink` for the References footer:
   ```
   list_events(startTime="<date>T08:00:00-05:00", endTime="<date>T18:00:00-05:00", fullText="<keyword>")
   ```
   - Use `start.dateTime` for the filename timestamp (e.g. `T1130`).
   - Use attendee emails to confirm participant identity when the Zoom paste only has first names.
   - If no event is found, fall back to user-provided time or date-only filename.

3. **Resolve the series and prior context** using the `notes-browser` MCP tools — run these in parallel:
   - `list_series` — find the canonical series name (exact spelling/casing) that matches this meeting. Use it verbatim in frontmatter.
   - `get_series_history(series_name, limit=3)` — get recent notes in the series. Use the returned note IDs to match the slug convention for the filename, and use the frontmatter (tags, participants) to stay consistent with prior entries.
   - `lookup_person(name)` — resolve first-name-only mentions from the Zoom paste to full names. Call once per ambiguous name.

4. **Build filename**: `YYYYMMDDTHHMM-<slug>.md`. Match the slug pattern of prior notes in the same series (visible in the IDs returned by `get_series_history`).

5. **Generate frontmatter** per the spec below.

6. **Write the body** per the spec below.

7. **Drop the file** in `~/dev/notes-browser/notes/` (flat, no subdirs).

8. **Verify ingestion** — see Verification section.

---

## Filename convention

`YYYYMMDDTHHMM-<slug>.md` — e.g. `20260417T1000-alan-vik-1-1.md`

- Slug: lowercase, hyphen-separated, ASCII. Drop punctuation; `1:1` becomes `1-1` or `11`.
- If time is unknown, fall back to `YYYYMMDD-<slug>.md`.

---

## Frontmatter spec

```yaml
---
title: <Title as spoken, e.g. "Alan / Jeff 1:1">
folder: Meeting Summaries
created: &id001 YYYY-MM-DD HH:MM:SS-05:00
modified: *id001
source: "Zoom AI"
source_id: meeting:<filename-stem-without-extension>
tags:
- <tag1>
- <tag2>
participants:
- <Full Name 1>
- <Full Name 2>
series: <Series Name>   # only if recurring; omit otherwise
---
```

Rules:
- `folder` is always `Meeting Summaries` for Zoom AI summaries.
- `source` is **always** `"Zoom AI"` (quoted) — do not copy the string from prior notes that say `"Evergreen"`.
- `created` uses the YAML anchor `&id001` and `modified` references it with `*id001` when the note is created from the summary (they are equal).
- Timezone: default to `-05:00` (user's operating timezone — Central). Only diverge if the paste specifies otherwise.
- `source_id` is `meeting:` + filename stem, e.g. `meeting:20260417T1000-alan-vik-1-1`.
- `participants` always includes **Alan Zoppa**. Use full first + last names; resolve via `lookup_person` when the paste has first names only.
- `series`: use the canonical name from `list_series` verbatim. Omit for one-off meetings.

### Canonical tag vocabulary

Pick 2–4 from this list. **Do not invent new tags** unless no existing tag fits:

- `1on1` — any two-person recurring sync
- `tech-leadership` — EM/lead-level topics
- `org-operations` — org-level process, staffing, leadership ops
- `infrastructure-ops` — hardware, CI, dev env, tooling
- `ai-features` — AI/LLM features, Claude Code, Cursor, agents
- `convert-demand` — Convert Demand squad work
- `octave-ebcg` — Octave / Evernorth Behavioral Care Group partnership
- `enterprise-partnerships` — other enterprise deals
- `mbc-measures` — Measurement-Based Care (PHQ-9, GAD-7, MHQOL)
- `rcm-billing` — Revenue Cycle Management
- `oar-group-practice` — Online Appointment Requests / group practice
- `product-design` — design/UX topics
- `clinical-compliance` — clinical/regulatory topics
- `eng-interviews` — interview process, hiring loops
- `onboarding` — new hire / onboarding

---

## Body spec

Structure (in order):

1. `# <Title>` — H1 matching frontmatter title exactly.
2. Optional `Notes` line on its own (carry forward if the series uses it).
3. `* tl;dr: <one-sentence summary>` — **always the first bullet**. Bold key people (`**Alan Zoppa**`) and projects (`**Octave (EBCG)**`). One sentence, packed with the actual outcome — not "we discussed X" but "X was decided / Y is blocked on Z".
4. **Topic sections.** Choose ONE structure and stay consistent within the series:
   - **Nested-bullet style** (most common, matches 1:1s): `* **Section Name**` then sub-bullets `  * ...`.
   - **H2 style** (used for longer working-group summaries): `## Section Name` then regular bullets.
   Match the style used in the series history returned by `get_series_history`.
5. `* Action Items` (or `## Action Items`) — bullets of the form `**<Person Name>**: <action>.`
6. `* Reference / Glossary` (or `## Reference / Glossary`) — bullets of the form `**<Term>**: <definition>.` Include any acronym or project name a future reader might not recognize.
7. Optional footer:
   ```
   ---
   ## References
   - Calendar: <gcal htmlLink, or "(not synced — recovered from Zoom Hub raw summary)">
   ```

### Inline conventions

- **Bold people on each mention**: `**Jeff Wiley**`. On first mention, include role in parens: `**Jeff Wiley** (Product)`.
- **Bold project / product names**: `**Octave (EBCG)**`, `**RCM**`, `**Therapy Finder**`, etc.
- Keep sentences declarative and specific. Preserve concrete numbers, dates, and names.
- Drop Zoom filler: "Thanks everyone", "good meeting", transcript timestamps, etc.
- Strip backslash-escaped parens (`Sr. Engineer 1\)` → `Sr. Engineer 1)`) — Zoom markdown artifacts.

---

## Writing the file

Use the Write tool with an absolute path:

```
/Users/alan.zoppa/dev/notes-browser/notes/<filename>.md
```

Do not create subdirectories. The notes dir is flat by design.

---

## Verification

After writing, call `get_stats` (notes-browser MCP) and compare `total_notes` to the count before writing. Then confirm the specific note was ingested:

```
get_notes_since(timestamp="<ISO timestamp just before you wrote the file>")
```

Look for your filename stem in the returned note IDs.

If the MCP tools error or return stale data (collection UUID mismatch after a force re-ingest), fall back to:
```bash
sleep 7 && curl -s http://localhost:8000/api/stats | python3 -m json.tool
```

If the backend is not running, tell the user:
> Backend at localhost:8000 is not responding. The file is written to disk but won't be indexed until you start the backend (`cd ~/dev/notes-browser/backend && source .venv/bin/activate && uvicorn main:app --reload --port 8000`). Ollama must also be running (`ollama serve`).

---

## Reporting back to the user

Keep it terse:
- Filename written.
- Confirmed ingestion + new `total_notes` count.
- Any tags/participants you inferred (so the user can correct).

Don't re-print the whole note body.
