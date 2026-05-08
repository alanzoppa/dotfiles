# OpenClaw Update System Reference

Internal details of the openclaw update, health, and backup systems.

## Update Flows

### Git Checkout (dev channel)

1. Verify clean worktree (`git status --porcelain`)
2. `git fetch --all --prune --tags`
3. Resolve upstream SHA on `main`
4. **Preflight**: create temp worktree → try each of last 10 commits (checkout → deps install → build → lint). First passing commit becomes rebase target.
5. `git rebase <selected-sha>`
6. `pnpm install` → `pnpm run build` → `pnpm run ui:build`
7. Verify `openclaw.mjs` entry point exists
8. `openclaw doctor --non-interactive --fix` (with `OPENCLAW_UPDATE_IN_PROGRESS=1`)
9. Verify control UI assets
10. Restart gateway, wait for healthy

### Package Install (stable/beta channel)

1. Detect package manager (pnpm → npm → bun)
2. Resolve install spec (`openclaw@latest`, `openclaw@beta`, or env override)
3. Run global install (`npm i -g <spec>`, etc.)
4. On primary failure, retry with `--omit=optional`
5. Verify installed version matches expected
6. Verify all `BUNDLED_RUNTIME_SIDECAR_PATHS` exist
7. Run `openclaw doctor --non-interactive`
8. Sync plugins for channel
9. Restart gateway, wait for healthy

### Auto-Update

Triggered on gateway startup via `scheduleGatewayUpdateCheck()`. Checks npm registry
periodically. Stable rollout uses SHA-256 hash of install ID + version + tag for
staggered delay (6h base + 0-12h jitter). Beta applies immediately.

Config in `~/.openclaw/openclaw.json`:
```json
{
  "update": {
    "auto": { "enabled": true, "stableDelayHours": 6, "stableJitterHours": 12 },
    "channel": "stable",
    "checkOnStart": true
  }
}
```

State persisted in `~/.openclaw/update-check.json`.

## Existing Integrity Mechanisms

| Mechanism | Location | What It Checks |
|-----------|----------|----------------|
| npm integrity | `src/infra/npm-integrity.ts` | Expected vs actual SHA-512 from npm registry |
| Plugin integrity drift | `src/plugins/update.ts` | Plugin npm integrity hash comparison |
| Bundled sidecars | `src/infra/update-global.ts` | All `BUNDLED_RUNTIME_SIDECAR_PATHS` exist after install |
| Doctor | `src/flows/doctor-health.ts` | 25 health contributions covering config, auth, state, plugins, channels, security |
| Config migration | Doctor preflight | Auto-strips unknown config keys introduced by schema changes |
| Plugin version check | `src/plugins/min-host-version.ts` | `openclaw.install.minHostVersion` compatibility |
| Security scan | `src/plugins/install-security-scan.ts` | Bundle/package/file-level security scanning before installs |

## Health Endpoints

| Path | Status | Meaning |
|------|--------|---------|
| `/healthz` | Always 200 | Gateway process is alive (`{ ok: true, status: "live" }`) |
| `/readyz` | 200 or 503 | All channels connected? 200 = ready, 503 = some channels failing |

`/readyz` response (authorized):
```json
{ "ready": true, "failing": [], "uptimeMs": 12345 }
```
or on failure:
```json
{ "ready": false, "failing": ["discord:account1"], "uptimeMs": 5000 }
```

Unauthorized `/readyz` returns only `{ "ready": true/false }` without details.

Readiness is cached for 1 second. Channels have grace periods and stale socket detection.

## Backup System

### Create

```
openclaw backup create [--output PATH] [--json] [--dry-run] [--verify] [--only-config] [--no-include-workspace]
```

Creates a `.tar.gz` archive containing:
- Config file (`openclaw.json`)
- State directory (sessions, agents, OAuth)
- Credentials (`openclaw.json.credentials`)
- Workspace directories (unless `--only-config`)
- Manifest (`manifest.json` with schema version, platform, node version, asset list)

Uses hard-links for atomic writes (falls back to exclusive copy).
Refuses to overwrite existing archives. Refuses to write inside a source path.

### Verify

```
openclaw backup verify <archive> [--json]
```

Validates archive structure: one `manifest.json` at root, all referenced assets
exist in `payload/` directory, no path traversal or absolute paths.

### Restore

```
openclaw backup restore <archive>
```

Restores config and state from archive.

Config backups are also kept at `~/.openclaw/openclaw.json.bak` on every write.

## Doctor Checks

`openclaw doctor [--non-interactive] [--fix] [--repair] [--deep]` runs 25 checks:

1. Gateway config (mode, auth)
2. Auth profiles (legacy ID repair)
3. Gateway auth (token)
4. Legacy state migration
5. Legacy plugin manifests
6. Bundled plugin runtime deps
7. **State integrity** (orphans, missing transcripts, permissions, cloud-sync detection)
8. Session locks (stale locks)
9. Legacy cron (job shape migration)
10. Sandbox (Docker availability)
11. Gateway services (duplicate services, env overrides)
12. Startup channel maintenance
13. Security warnings
14. Browser (Chrome/MCP readiness)
15. OAuth TLS
16. Hooks model validation
17. systemd linger
18. Workspace status
19. Bootstrap size
20. Shell completion
21. **Gateway health** (alive, responsive, memory)
22. Memory search readiness
23. Gateway daemon (restart if needed)
24. Write config (if modified)
25. Workspace suggestions
26. Final config validation

`--fix` / `--repair` auto-applies fixes. `--non-interactive` runs without prompts.

## Health Command

```
openclaw health [--verbose] [--json]
```

Queries the running gateway for health summary. Returns per-channel status with
per-account probe results. `--verbose` adds connection details and timing.
When gateway is unreachable, falls back to local probing.

## Status Scan

```
openclaw status scan [--json]
```

Deep scan: loads all plugins, checks configuration, reports per-plugin status
(loaded/error/disabled). Includes auth profile checks and channel status.

## Channel Bootstrapping

Channels are bootstrapped on gateway startup:
1. `bootstrapOutboundChannelPlugin()` checks config for channel presence
2. Resolves plugin via `resolveRuntimePluginRegistry()`
3. Calls channel-specific setup adapter
4. Channel health monitored via `/readyz` endpoint

Failed channels appear in `/readyz` response under `failing[]` array and show
as `linked: false` or `probe.ok: false` in `openclaw health --json`.

## Manual Rollback

From the openclaw docs:

```bash
# Install a specific version
npm i -g openclaw@2026.4.11

# Then run doctor and restart
openclaw doctor
openclaw gateway restart
```

For git checkouts: `git checkout <previous-commit>` then `pnpm install && pnpm run build`.

## Auto-Update Configuration

| Config Key | Default | Description |
|-----------|---------|-------------|
| `update.auto.enabled` | `true` | Enable auto-updates on gateway startup |
| `update.auto.stableDelayHours` | `6` | Hours to wait before applying stable updates |
| `update.auto.stableJitterHours` | `12` | Random jitter window for stable rollout |
| `update.auto.betaCheckIntervalHours` | `1` | Beta check frequency |
| `update.channel` | `"stable"` | Update channel (`stable`, `beta`, `dev`) |
| `update.checkOnStart` | `true` | Show update hints at gateway start |
| `OPENCLAW_UPDATE_PACKAGE_SPEC` | — | Env override for install target (e.g. `openclaw@2026.4.11`) |
| `OPENCLAW_AUTO_UPDATE` | — | Set to `1` during auto-update invocations |
| `OPENCLAW_UPDATE_IN_PROGRESS` | — | Set to `1` during doctor runs within update flow |