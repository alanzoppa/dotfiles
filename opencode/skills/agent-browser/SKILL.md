---
name: agent-browser
description: Browser automation via the agent-browser CLI. Use when you need to navigate websites, fill forms, click buttons, take screenshots, extract data, test web apps, log into sites, or automate any browser task. Also use for web scraping, QA testing, and visual verification of deployed apps.
allowed-tools: Bash(agent-browser:*)
---

# agent-browser

Fast browser automation CLI for AI agents. Chrome/Chromium via CDP with accessibility-tree snapshots and compact `@eN` element refs.

## Install

```bash
npm i -g agent-browser && agent-browser install
```

Already installed (v0.26.0). Chrome for Testing is at `~/.agent-browser/browsers/`.

## Headed vs Headless modes

The user often wants to **log in manually first** (in headed/foreground mode), then **automate headless** thereafter.

### Step 1: Open headed browser for manual login

```bash
agent-browser --headed open <url>
# User logs in manually in the Chrome window
# Wait for the user to confirm they've finished logging in
```

### Step 2: Save auth state after login

```bash
agent-browser state save ./auth-state.json
# Or use session persistence:
# agent-browser --session-name myapp state save
```

### Step 3: Close the headed browser, reopen headless with saved state

```bash
agent-browser close
agent-browser --state ./auth-state.json open <url>
# Now running headless with the authenticated session
```

### Alternative: Persistent profile (no state file management)

```bash
# First time: headed login
agent-browser --profile ~/.myapp-profile --headed open https://app.example.com/login
# ... user logs in ...
agent-browser close

# All subsequent runs: already authenticated, can be headless
agent-browser --profile ~/.myapp-profile open https://app.example.com/dashboard
```

### Alternative: Auto-connect to an existing Chrome window

If the user already has Chrome open with remote debugging:

```bash
# User starts Chrome: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --remote-debugging-port=9222
agent-browser --auto-connect state save ./auth-state.json
agent-browser --state ./auth-state.json open <url>
```

## The core loop

```bash
agent-browser open <url>        # 1. Open a page
agent-browser snapshot -i       # 2. See what's on it (interactive elements only)
agent-browser click @e3         # 3. Act on refs from the snapshot
agent-browser snapshot -i       # 4. Re-snapshot after any page change
```

**Refs (`@e1`, `@e2`, ...) are assigned fresh on every snapshot.** They become stale the moment the page changes. Always re-snapshot before your next ref interaction.

## Reading a page

```bash
agent-browser snapshot                    # full tree (verbose)
agent-browser snapshot -i                 # interactive elements only (preferred)
agent-browser snapshot -i -c              # compact (no empty structural nodes)
agent-browser snapshot -i -d 3            # cap depth at 3 levels
agent-browser snapshot -s "#main"         # scope to a CSS selector
agent-browser snapshot -i --json          # machine-readable output
agent-browser get text @e1               # visible text of an element
agent-browser get html @e1               # innerHTML
agent-browser get attr @e1 href          # any attribute
agent-browser get title                  # page title
agent-browser get url                    # current URL
agent-browser get count ".item"          # count matching elements
```

## Interacting

```bash
agent-browser click @e1                   # click
agent-browser click @e1 --new-tab         # open link in new tab
agent-browser fill @e2 "hello"            # clear then type
agent-browser type @e2 " world"           # type without clearing
agent-browser press Enter                 # press a key
agent-browser press Control+a             # key combination
agent-browser check @e3                   # check checkbox
agent-browser select @e4 "option-value"   # dropdown select
agent-browser scroll down 500             # scroll page
agent-browser scrollintoview @e1          # scroll element into view
agent-browser upload @e5 file.pdf         # upload file
```

## Semantic locators (no snapshot needed)

```bash
agent-browser find role button click --name "Submit"
agent-browser find text "Sign In" click
agent-browser find label "Email" fill "user@test.com"
agent-browser find placeholder "Search" type "query"
agent-browser find testid "submit-btn" click
```

## Waiting (critical for reliability)

```bash
agent-browser wait @e1                     # until element appears
agent-browser wait 2000                    # dumb wait (last resort)
agent-browser wait --text "Success"        # until text appears
agent-browser wait --url "**/dashboard"    # until URL matches
agent-browser wait --load networkidle      # until network idle
```

## Screenshots

```bash
agent-browser screenshot                        # temp path
agent-browser screenshot page.png               # specific path
agent-browser screenshot --full full.png         # full page
agent-browser screenshot --annotate map.png      # numbered labels keyed to refs
```

## Auth vault (passwords never exposed in chat)

```bash
agent-browser auth save myapp --url https://app.example.com/login --username user@example.com --password-stdin
agent-browser auth login myapp    # fills + clicks, waits for form
agent-browser auth list           # list saved profiles
```

## Session persistence

```bash
# Quick: auto-save/restore by name
agent-browser --session-name myapp open https://app.example.com
# ... login ...
agent-browser close
# Next run auto-restores:
agent-browser --session-name myapp open https://app.example.com

# Manual: save/load state files
agent-browser state save ./auth.json
agent-browser --state ./auth.json open https://app.example.com
```

## Tabs

```bash
agent-browser tab                          # list tabs
agent-browser tab new https://example.com  # new tab (and switch)
agent-browser tab new --label docs https://docs.example.com
agent-browser tab docs                     # switch by label
agent-browser tab close                    # close current tab
```

## Multiple sessions (parallel browsers)

```bash
agent-browser --session a open https://example.com
agent-browser --session b open https://example.com
agent-browser --session a snapshot -i
agent-browser --session b snapshot -i
```

## JavaScript evaluation

```bash
agent-browser eval "document.title"                    # simple expression
cat <<'EOF' | agent-browser eval --stdin                # complex script via heredoc
const rows = document.querySelectorAll("table tbody tr");
Array.from(rows).map(r => r.cells[0].innerText);
EOF
```

## Common patterns for this project

### Testing the notes-browser locally

```bash
agent-browser open http://localhost:3000
agent-browser snapshot -i
# Navigate, search, verify UI
```

### Checking a deployed app behind Tailscale

```bash
agent-browser open http://notes-browser.tailnet-host:3000
agent-browser snapshot -i
```

### Scraping a page for content

```bash
agent-browser open https://example.com
agent-browser wait --load networkidle
agent-browser get text body
```

## Troubleshooting

- **"Ref not found"**: Re-run `agent-browser snapshot -i` — refs stale after page changes
- **Element not in snapshot**: Scroll down or `agent-browser wait 1000` then re-snapshot
- **Click does nothing**: Dismiss overlay/cookie banner first
- **Fill doesn't work**: Try `agent-browser focus @e1 && agent-browser keyboard inserttext "text"`
- **Auth expires**: Use `--session-name` or `--profile` for persistence
- **Daemon issues**: Run `agent-browser doctor --fix`

## Quick reference

| Task | Command |
|------|---------|
| Open page | `agent-browser open <url>` |
| See page | `agent-browser snapshot -i` |
| Click element | `agent-browser click @eN` |
| Fill input | `agent-browser fill @eN "text"` |
| Type text | `agent-browser type @eN "text"` |
| Press key | `agent-browser press Enter` |
| Wait for element | `agent-browser wait @eN` |
| Wait for URL | `agent-browser wait --url "**/path"` |
| Wait for network | `agent-browser wait --load networkidle` |
| Screenshot | `agent-browser screenshot [path]` |
| Get text | `agent-browser get text @eN` |
| Get URL | `agent-browser get url` |
| Save auth | `agent-browser state save <path>` |
| Load auth | `agent-browser --state <path> open <url>` |
| Headed mode | `agent-browser --headed open <url>` |
| Persistent profile | `agent-browser --profile <path> open <url>` |
| Session name | `agent-browser --session-name <name> open <url>` |
| Close | `agent-browser close` |
| JSON output | `agent-browser --json <command>` |