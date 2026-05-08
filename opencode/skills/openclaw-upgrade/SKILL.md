---
name: openclaw-upgrade
description: >
  Safely upgrade OpenClaw with pre/post integrity checks, automatic rollback
  on failure, and channel/plugin verification. Use when upgrading openclaw,
  verifying an update succeeded, or rolling back a failed update.
  Triggers on: "upgrade openclaw", "update openclaw", "verify openclaw
  update", "rollback openclaw", "openclaw update check", "is openclaw
  healthy after update".
metadata:
  {"openclaw": {"requires": {"bins": ["openclaw"]}}}
---

# OpenClaw Upgrade Protocol

Safely upgrade OpenClaw by running integrity checks before and after the
update, with automatic rollback on failure.

## Quick Start

Full upgrade with automatic verification and rollback:

```bash
{baseDir}/scripts/verify.sh --full [--channel stable|beta|dev] [--timeout 120]
```

## Phases

### 1. Pre-Update

Confirm the current state is healthy before changing anything.

```bash
{baseDir}/scripts/verify.sh --pre
```

- Check gateway is reachable at `/healthz`
- Record current version (`openclaw --version`)
- Record config hash for change detection
- Create a verified backup (`openclaw backup create --verify`)
- Capture current channel status (`openclaw health --json`)
- Write state to `/tmp/openclaw-upgrade-state.json`
- **Abort** if gateway is already unhealthy (exit code 1)

### 2. Execute Update

```bash
openclaw update --yes [--channel stable|beta|dev] [--tag TAG]
```

The `--full` mode runs this automatically. For manual control, run it
yourself then proceed to post-update verification.

**Channel guide:**

| Channel | Tag | Risk | Source |
|---------|-----|------|--------|
| `stable` | `latest` | Lowest | npm `openclaw@latest` |
| `beta` | `beta` | Medium | npm `openclaw@beta` |
| `dev` | `main` | Highest | git rebase |

Check current channel: `openclaw update status`

### 3. Post-Update Verification

```bash
{baseDir}/scripts/verify.sh --post
```

- Wait for gateway `/healthz` (default 60s timeout)
- Wait for gateway `/readyz` (channels connected)
- Verify version changed from pre-update snapshot
- Run `openclaw doctor --non-interactive`
- Verify all configured channels are linked and probing OK
- Verify all plugins loaded without errors
- On failure: proceed to rollback

### 4. Rollback

```bash
{baseDir}/scripts/verify.sh --rollback
```

- Read previous version from state file
- Reinstall: `npm i -g "openclaw@${PREV_VERSION}"` (or pnpm/bun)
- Restore config from backup archive
- Restart gateway: `openclaw gateway restart`
- Wait for gateway healthy
- If rollback fails, print manual recovery instructions

## Verify Current State

Check whether OpenClaw is healthy without updating:

```bash
{baseDir}/scripts/verify.sh --verify-only [--timeout 30]
```

## Options

| Flag | Default | Description |
|------|---------|-------------|
| `--pre` | — | Pre-update phase only |
| `--post` | — | Post-update phase only |
| `--rollback` | — | Rollback phase only |
| `--full` | — | Pre → update → post, rollback on failure |
| `--verify-only` | — | Check current health without updating |
| `--channel NAME` | from config | Update channel |
| `--timeout SEC` | `60` | Gateway health check timeout |
| `--json` | — | JSON output |
| `--dry-run` | — | Show what would be done |
| `--state-file PATH` | `/tmp/openclaw-upgrade-state.json` | State file path |

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Pre-update check failed (gateway unhealthy) |
| 2 | Update command failed |
| 3 | Post-verification failed (rollback succeeded) |
| 4 | Post-verification + rollback both failed |
| 5 | Backup creation/verification failed |

## Troubleshooting

**Gateway won't start:** Check logs (`openclaw gateway logs`), try `openclaw doctor --repair`, or rollback with `verify.sh --rollback`.

**Channel not connecting:** Run `openclaw health --verbose` for per-account details, `openclaw doctor --repair` for fixes, or re-link with `openclaw channels login <channel>`.

**Config keys removed:** `openclaw doctor --fix` auto-strips unknown keys. Backup at `~/.openclaw/openclaw.json.bak`.

**Rollback fails:** Manually install previous version (`npm i -g "openclaw@VERSION"`), restore config (`openclaw backup restore <archive>`), then `openclaw gateway restart`.

## Internals

See [references/update-system.md](references/update-system.md) for update flow internals, health endpoints, backup system, and auto-update configuration.