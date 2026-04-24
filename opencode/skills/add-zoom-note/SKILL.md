---
name: add-zoom-note
description: Format a raw Zoom AI meeting summary into a properly structured markdown note and add it to the notes-browser corpus at ~/dev/notes-browser/notes/, then verify the watcher picked it up.
---

# Add Zoom Note

Use this skill when the user pastes a raw Zoom AI Companion meeting summary and wants it formatted and filed into the notes corpus.

The notes live at `~/dev/notes-browser/notes/` and are watched by a FastAPI backend that auto-ingests them into ChromaDB with embeddings (Ollama `nomic-embed-text-v2-moe`). After dropping the file you **must** verify the watcher event.

---

## Workflow

1. **Parse** the Zoom paste: extract meeting title, date/time, participants, and topic blocks. Convert relative dates ("yesterday", "Tuesday") to absolute using today's date from the environment context.
2. **Check for a prior note in the same series** before writing. Run:
   ```bash
   ls ~/dev/notes-browser/notes/ | grep -i '<slug>' | tail -5
   ```
   If this is a recurring series (1:1, squad meeting, working group), read the most recent prior note to match tone, section structure, tag set, and `series:` value. Consistency across a series matters more than re-deriving style from scratch each time.
3. **Build filename**: `YYYYMMDDTHHMM-<slug>.md` where slug is kebab-case of the title, ASCII-only.
4. **Generate frontmatter** per the spec below.
5. **Write the body** per the spec below.
6. **Drop the file** in `~/dev/notes-browser/notes/` (flat, no subdirs).
7. **Verify ingestion** — see Verification section.

---

## Filename convention

`YYYYMMDDTHHMM-<slug>.md` — e.g. `20260417T1000-alan-vik-1-1.md`

- Slug: lowercase, hyphen-separated, ASCII. Drop punctuation; `1:1` becomes `1-1` or `11`. Match the slug of prior notes in the same series (check with `ls ~/dev/notes-browser/notes/ | grep <series-keyword>`).
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
- `created` uses the YAML anchor `&id001` and `modified` references it with `*id001` when the note is created from the summary (they are equal). If the user later edits, update `modified` separately.
- Timezone: default to `-05:00` (user's operating timezone — Central). Only diverge if the paste specifies otherwise.
- `source_id` is `meeting:` + filename stem, e.g. `meeting:20260417T1000-alan-vik-1-1`.
- `participants` always includes **Alan Zoppa**. Use full first + last names. Infer surnames from prior notes in the same series when the Zoom paste only has first names.
- `series`: include for recurring meetings (1:1s, squad meetings, working groups). Format matches the prior note exactly (e.g. `Alan/Jeff 1:1`, `Convert Demand Engineering`, `Eng Interviews working group`). Omit for one-off meetings.
- Check existing notes for spelling of proper nouns.

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
2. Optional `Notes` line on its own (carried from prior notes in some series — match what the series uses).
3. `* tl;dr: <one-sentence summary>` — **always the first bullet**. Bold key people (`**Alan Zoppa**`) and projects (`**Octave (EBCG)**`). One sentence, packed with the meeting's actual outcome — not "we discussed X" but "X was decided / Y is blocked on Z".
4. **Topic sections.** Choose ONE structure and stay consistent within the note:
   - **Nested-bullet style** (most common, matches 1:1s): `* **Section Name**` then sub-bullets `  * ...`.
   - **H2 style** (used for longer working-group summaries): `## Section Name` then regular bullets.
   Match the style of the prior note in the same series if one exists.
5. `* Action Items` (or `## Action Items`) — bullets of the form `**<Person Name>**: <action>.`
6. `* Reference / Glossary` (or `## Reference / Glossary`) — bullets of the form `**<Term>**: <definition>.` Include any acronym or project name used in the note that a future reader might not recognize.
7. Optional footer:
   ```
   ---
   ## References
   - Calendar: <gcal link if provided, else "(not synced — recovered from Zoom Hub raw summary)">
   ```
   Only include the Calendar line if the user provides a link OR the Zoom paste is clearly not calendar-synced. The notes themselves must be a single list indented for clarity.

### Inline conventions

- **Bold people on each mention**: `**Jeff Wiley**`. On first mention, include role in parens: `**Jeff Wiley** (Product)`, `**Kyle Kermgard** (Sr. Engineer 1)`.
- **Bold project / product names**: `**Octave (EBCG)**`, `**RCM**`, `**FHIR API**`, `**Therapy Finder**`, `**Greenhouse**`, `**Docker**`.
- Keep sentences declarative and specific. Preserve concrete numbers, dates, and names from the Zoom paste — don't generalize.
- Drop Zoom filler: "Thanks everyone", "good meeting", timestamps in the transcript, etc.
- If the Zoom paste used backslash-escaped parens like `Sr. Engineer 1\)`, strip the backslashes — they are Zoom markdown artifacts.

---

## Writing the file

Use the Write tool with an absolute path:

```
/Users/alan.zoppa/dev/notes-browser/notes/<filename>.md
```

Do not create subdirectories. The notes dir is flat by design.

---

## Verification

After writing, confirm the watcher picked up the file. The FastAPI backend runs on port 8000 and has a `/api/watcher/status` endpoint.

```bash
sleep 7 && curl -s http://localhost:8000/api/watcher/status | python3 -m json.tool
```

(The watcher debounces for 5 seconds before processing, so sleep at least 6–7.)

Look for an entry in `recent_events` with `"type": "upsert"` and your filename. Also cross-check the note count went up by 1:

```bash
curl -s http://localhost:8000/api/stats | python3 -m json.tool
```

If the backend is not running, tell the user:
> Backend at localhost:8000 is not responding. The file is written to disk but won't be indexed until you start the backend (`cd ~/dev/notes-browser/backend && source .venv/bin/activate && uvicorn main:app --reload --port 8000`). Ollama must also be running (`ollama serve`).

If the watcher is running but your file is NOT in `recent_events` after 10 seconds, something went wrong — surface the error rather than claiming success.

---

## Reporting back to the user

Keep it terse:
- Filename written.
- Confirmed watcher event + new `total_notes` count.
- Any tags/participants you inferred from prior notes (so the user can correct).

Don't re-print the whole note body — the user pasted the source, they know what's in it.
