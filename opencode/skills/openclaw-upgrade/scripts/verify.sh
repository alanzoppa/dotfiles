#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$(dirname "$SCRIPT_DIR")"
DEFAULT_STATE_FILE="/tmp/openclaw-upgrade-state.json"
DEFAULT_TIMEOUT=60
DEFAULT_CHANNEL=""

PHASE=""
CHANNEL="$DEFAULT_CHANNEL"
TIMEOUT="$DEFAULT_TIMEOUT"
STATE_FILE="$DEFAULT_STATE_FILE"
JSON_OUTPUT=false
DRY_RUN=false

usage() {
  cat <<'EOF'
Usage: verify.sh [OPTIONS] PHASE

Phases:
  --pre           Pre-update checks (health, backup, snapshot)
  --post          Post-update verification (health, channels, plugins)
  --rollback      Rollback to previous version
  --full          Full cycle: pre → update → post (rollback on failure)
  --verify-only   Check current health without updating

Options:
  --channel NAME    Update channel: stable, beta, dev (default: from config)
  --timeout SEC     Gateway health check timeout in seconds (default: 60)
  --state-file PATH State file path (default: /tmp/openclaw-upgrade-state.json)
  --json            Output JSON for machine parsing
  --dry-run         Show what would be done without executing
  -h, --help        Show this help

Exit codes:
  0  Success
  1  Pre-update check failed (gateway unhealthy or backup failed)
  2  Update command failed
  3  Post-verification failed (rollback succeeded)
  4  Post-verification and rollback both failed
  5  Backup creation or verification failed
EOF
}

log() { echo "[openclaw-upgrade] $*"; }
warn() { echo "[openclaw-upgrade] WARNING: $*" >&2; }
err() { echo "[openclaw-upgrade] ERROR: $*" >&2; }

json_out() {
  if $JSON_OUTPUT; then
    cat
  else
    cat >/dev/null
  fi
}

detect_pkg_manager() {
  if command -v pnpm &>/dev/null; then echo "pnpm"
  elif command -v npm &>/dev/null; then echo "npm"
  elif command -v bun &>/dev/null; then echo "bun"
  else echo "npm"
  fi
}

resolve_gateway_port() {
  local config="$HOME/.openclaw/openclaw.json"
  if [[ -f "$config" ]]; then
    local port
    port=$(node -e "try{const c=require('$config');console.log(c.gateway?.port||18789)}catch(e){console.log(18789)}" 2>/dev/null || echo "18789")
    echo "$port"
  else
    echo "18789"
  fi
}

wait_for_healthz() {
  local port="$1" timeout="$2"
  local elapsed=0
  while (( elapsed < timeout )); do
    if curl -sf "http://localhost:${port}/healthz" &>/dev/null; then
      return 0
    fi
    sleep 2
    elapsed=$((elapsed + 2))
  done
  return 1
}

wait_for_readyz() {
  local port="$1" timeout="$2"
  local elapsed=0
  while (( elapsed < timeout )); do
    local resp
    resp=$(curl -sf -o /dev/null -w '%{http_code}' "http://localhost:${port}/readyz" 2>/dev/null || echo "000")
    if [[ "$resp" == "200" ]]; then
      return 0
    fi
    sleep 3
    elapsed=$((elapsed + 3))
  done
  return 1
}

get_version() {
  openclaw --version 2>/dev/null | head -1 | sed 's/^openclaw //' || echo "unknown"
}

get_config_hash() {
  local config="$HOME/.openclaw/openclaw.json"
  if [[ -f "$config" ]]; then
    sha256sum "$config" | cut -d' ' -f1
  else
    echo "no-config"
  fi
}

create_backup() {
  local output
  output=$(openclaw backup create --verify --no-include-workspace --json 2>&1)
  local rc=$?
  echo "$output"
  return $rc
}

rollback_install_prev() {
  local prev_version="$1"
  local pkg_mgr
  pkg_mgr=$(detect_pkg_manager)
  local install_spec="openclaw@${prev_version}"

  log "Rolling back to version ${prev_version} using ${pkg_mgr}..."

  case "$pkg_mgr" in
    pnpm) pnpm add -g "$install_spec" ;;
    npm)  npm i -g "$install_spec" --no-fund --no-audit --loglevel=error ;;
    bun)  bun add -g "$install_spec" ;;
  esac
}

extract_backup_config() {
  local archive="$1"
  local tmpdir
  tmpdir=$(mktemp -d)
  tar xzf "$archive" -C "$tmpdir" --wildcards '*/payload/posix/home/*' 2>/dev/null || true
  local config_found
  config_found=$(find "$tmpdir" -name "openclaw.json" -path "*/payload/*" | head -1)
  if [[ -n "$config_found" ]]; then
    log "Restoring config from backup archive..."
    cp "$config_found" "$HOME/.openclaw/openclaw.json"
    log "Config restored."
  else
    warn "Could not find openclaw.json in backup archive. Config not restored."
  fi
  rm -rf "$tmpdir"
}

# ─── PHASES ──────────────────────────────────────────────────────────────────

do_pre() {
  log "=== Pre-Update Phase ==="
  local port
  port=$(resolve_gateway_port)

  # Check gateway is healthy before we start
  log "Checking gateway health (port ${port})..."
  if ! curl -sf "http://localhost:${port}/healthz" &>/dev/null; then
    err "Gateway is not healthy at http://localhost:${port}/healthz. Aborting."
    exit 1
  fi
  log "Gateway is healthy."

  # Record current state
  local version config_hash
  version=$(get_version)
  config_hash=$(get_config_hash)
  log "Current version: ${version}"

  # Capture channel status
  local health_json=""
  if command -v openclaw &>/dev/null; then
    health_json=$(openclaw health --json 2>/dev/null || echo "{}")
  fi

  # Create backup
  log "Creating backup..."
  local backup_output backup_archive
  backup_output=$(create_backup)
  if [[ $? -ne 0 ]]; then
    err "Backup creation or verification failed."
    err "$backup_output"
    exit 5
  fi
  backup_archive=$(echo "$backup_output" | node -e "
    const lines = require('fs').readFileSync(0,'utf8').split('\n');
    const archLine = lines.find(l => l.includes('archive') || l.includes('.tar.gz'));
    if (archLine) { try { const j = JSON.parse(lines.join('\n')); console.log(j.archive || j.path || ''); } catch(e) { console.log(archLine.trim()); } }
    else console.log('');
  " 2>/dev/null || echo "")

  if $DRY_RUN; then
    log "[DRY RUN] Would write state file to ${STATE_FILE}"
    log "[DRY RUN] Would proceed to update."
    return 0
  fi

  # Write state file
  cat > "$STATE_FILE" <<STATE_EOF
{
  "prevVersion": "${version}",
  "prevChannel": "${CHANNEL:-stable}",
  "configHash": "${config_hash}",
  "gatewayPort": ${port},
  "backupArchive": "${backup_archive}",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
STATE_EOF
  log "State saved to ${STATE_FILE}"

  # Also save health JSON alongside for post-comparison
  if [[ -n "$health_json" ]]; then
    echo "$health_json" > "${STATE_FILE%.json}-health-pre.json"
  fi

  log "Pre-update checks passed."
}

do_update() {
  log "=== Update Phase ==="
  local channel_arg=""
  if [[ -n "$CHANNEL" ]]; then
    channel_arg="--channel ${CHANNEL}"
  fi

  if $DRY_RUN; then
    log "[DRY RUN] Would run: openclaw update --yes ${channel_arg}"
    return 0
  fi

  log "Running openclaw update..."
  if ! openclaw update --yes ${channel_arg}; then
    err "Update command failed."
    exit 2
  fi
  log "Update completed."
}

do_post() {
  log "=== Post-Update Verification Phase ==="
  local port
  port=$(resolve_gateway_port)

  # Wait for gateway to come back
  log "Waiting for gateway healthz (timeout: ${TIMEOUT}s)..."
  if $DRY_RUN; then
    log "[DRY RUN] Would wait for http://localhost:${port}/healthz"
  elif ! wait_for_healthz "$port" "$TIMEOUT"; then
    err "Gateway did not become healthy within ${TIMEOUT}s."
    return 1
  else
    log "Gateway is healthy."
  fi

  log "Waiting for gateway readyz (timeout: ${TIMEOUT}s)..."
  if $DRY_RUN; then
    log "[DRY RUN] Would wait for http://localhost:${port}/readyz"
  elif ! wait_for_readyz "$port" "$TIMEOUT"; then
    warn "Gateway not fully ready within ${TIMEOUT}s. Some channels may still be connecting."
  else
    log "Gateway is ready."
  fi

  # Verify version changed
  local prev_version new_version
  if [[ -f "$STATE_FILE" ]]; then
    prev_version=$(node -e "const s=require('$STATE_FILE');console.log(s.prevVersion||'unknown')" 2>/dev/null || echo "unknown")
  else
    warn "No state file found. Skipping version change check."
    prev_version="unknown"
  fi
  new_version=$(get_version)
  log "Previous version: ${prev_version}, Current version: ${new_version}"

  if [[ "$prev_version" != "unknown" && "$prev_version" == "$new_version" ]]; then
    warn "Version did not change: ${prev_version} == ${new_version}. Update may not have applied."
  fi

  # Run doctor
  log "Running openclaw doctor --non-interactive..."
  if $DRY_RUN; then
    log "[DRY RUN] Would run: openclaw doctor --non-interactive"
  else
    local doctor_output
    doctor_output=$(openclaw doctor --non-interactive 2>&1) || true
    if echo "$doctor_output" | grep -qi "fail\|error\|fix"; then
      warn "Doctor reported issues. Review output:"
      echo "$doctor_output" | grep -i "fail\|error\|fix" | head -10 >&2
    else
      log "Doctor passed."
    fi
  fi

  # Check channel health
  log "Checking channel health..."
  if $DRY_RUN; then
    log "[DRY RUN] Would run: openclaw health --json"
  else
    local health_json exit_code
    health_json=$(openclaw health --json 2>/dev/null) && exit_code=0 || exit_code=$?
    if [[ $exit_code -ne 0 ]]; then
      warn "Could not retrieve channel health."
    else
      local failed_channels
      failed_channels=$(echo "$health_json" | node -e "
        let failed = [];
        try {
          const h = JSON.parse(require('fs').readFileSync(0,'utf8'));
          if (h.channels) {
            for (const [name, ch] of Object.entries(h.channels)) {
              if (ch.linked === false || ch.probe?.ok === false) failed.push(name);
            }
          }
        } catch(e) {}
        console.log(failed.join(','));
      " 2>/dev/null || echo "")
      if [[ -n "$failed_channels" ]]; then
        warn "Channels with issues: ${failed_channels}"
      else
        log "All channels healthy."
      fi
    fi
  fi

  # Check plugins
  log "Checking plugin status..."
  if ! $DRY_RUN; then
    local status_output
    status_output=$(openclaw status scan --json 2>/dev/null || echo "{}")
    local plugin_errors
    plugin_errors=$(echo "$status_output" | node -e "
      let errs = [];
      try {
        const s = JSON.parse(require('fs').readFileSync(0,'utf8'));
        if (s.plugins) {
          for (const p of s.plugins) {
            if (p.status === 'error') errs.push(p.name || p.id);
          }
        }
      } catch(e) {}
      console.log(errs.join(','));
    " 2>/dev/null || echo "")
    if [[ -n "$plugin_errors" ]]; then
      warn "Plugins with errors: ${plugin_errors}"
    else
      log "All plugins OK."
    fi
  fi

  log "Post-update verification complete."
  return 0
}

do_rollback() {
  log "=== Rollback Phase ==="

  if [[ ! -f "$STATE_FILE" ]]; then
    err "No state file found at ${STATE_FILE}. Cannot determine previous version."
    err "Manual rollback: npm i -g openclaw@<previous-version> && openclaw gateway restart"
    return 1
  fi

  local prev_version backup_archive port
  prev_version=$(node -e "const s=require('$STATE_FILE');console.log(s.prevVersion)" 2>/dev/null || echo "")
  backup_archive=$(node -e "const s=require('$STATE_FILE');console.log(s.backupArchive||'')" 2>/dev/null || echo "")
  port=$(node -e "const s=require('$STATE_FILE');console.log(s.gatewayPort||18789)" 2>/dev/null || echo "18789")

  if [[ -z "$prev_version" ]]; then
    err "Could not read previous version from state file."
    return 1
  fi

  if $DRY_RUN; then
    log "[DRY RUN] Would rollback to version ${prev_version}"
    log "[DRY RUN] Would restore config from: ${backup_archive:-'(no archive)'}"
    log "[DRY RUN] Would restart gateway"
    return 0
  fi

  # Reinstall previous version
  if ! rollback_install_prev "$prev_version"; then
    err "Failed to install version ${prev_version}."
    err "Try manually: npm i -g openclaw@${prev_version}"
    return 1
  fi
  log "Installed version ${prev_version}."

  # Restore config from backup if available
  if [[ -n "$backup_archive" && -f "$backup_archive" ]]; then
    log "Restoring config from backup: ${backup_archive}"
    openclaw backup restore "$backup_archive" 2>/dev/null || extract_backup_config "$backup_archive" || true
  else
    warn "No backup archive available. Config not restored."
  fi

  # Restart gateway
  log "Restarting gateway..."
  openclaw gateway restart 2>/dev/null || true

  # Wait for healthy
  log "Waiting for gateway to become healthy..."
  if wait_for_healthz "$port" "$TIMEOUT"; then
    local rolled_back_version
    rolled_back_version=$(get_version)
    log "Rollback successful. Version: ${rolled_back_version}"
    return 0
  else
    err "Gateway did not become healthy after rollback."
    err "Manual steps: openclaw doctor --repair && openclaw gateway restart"
    return 1
  fi
}

do_verify_only() {
  log "=== Verify Current State ==="
  local port
  port=$(resolve_gateway_port)

  if ! curl -sf "http://localhost:${port}/healthz" &>/dev/null; then
    err "Gateway is not healthy."
    exit 1
  fi
  log "Gateway healthz: OK"

  if wait_for_readyz "$port" 30; then
    log "Gateway readyz: OK"
  else
    warn "Gateway readyz: not ready (some channels may be disconnected)."
  fi

  local version
  version=$(get_version)
  log "Version: ${version}"

  if ! $DRY_RUN; then
    log "Running doctor..."
    openclaw doctor --non-interactive 2>&1 | tail -5 || true

    log "Channel health:"
    openclaw health --json 2>/dev/null | node -e "
      try {
        const h = JSON.parse(require('fs').readFileSync(0,'utf8'));
        if (h.channels) {
          for (const [name, ch] of Object.entries(h.channels)) {
            const status = ch.linked === false ? 'NOT LINKED' : (ch.probe?.ok === false ? 'PROBE FAIL' : 'OK');
            console.log('  ' + name + ': ' + status);
          }
        } else console.log('  No channels configured.');
      } catch(e) { console.log('  Could not parse health output.'); }
    " 2>/dev/null || warn "Could not retrieve channel health."
  fi

  log "Verification complete."
}

# ─── MAIN ────────────────────────────────────────────────────────────────────

while [[ $# -gt 0 ]]; do
  case "$1" in
    --pre)          PHASE="pre" ;;
    --post)         PHASE="post" ;;
    --rollback)     PHASE="rollback" ;;
    --full)         PHASE="full" ;;
    --verify-only)  PHASE="verify-only" ;;
    --channel)      CHANNEL="$2"; shift ;;
    --timeout)      TIMEOUT="$2"; shift ;;
    --state-file)   STATE_FILE="$2"; shift ;;
    --json)         JSON_OUTPUT=true ;;
    --dry-run)      DRY_RUN=true ;;
    -h|--help)      usage; exit 0 ;;
    *)              err "Unknown option: $1"; usage; exit 1 ;;
  esac
  shift
done

if [[ -z "$PHASE" ]]; then
  err "No phase specified. Use --pre, --post, --rollback, --full, or --verify-only."
  usage
  exit 1
fi

case "$PHASE" in
  pre)
    do_pre
    ;;
  post)
    if ! do_post; then
      err "Post-update verification failed. Consider running --rollback."
      exit 3
    fi
    ;;
  rollback)
    if ! do_rollback; then
      exit 4
    fi
    ;;
  full)
    do_pre
    do_update
    if ! do_post; then
      err "Post-update verification failed. Rolling back..."
      if do_rollback; then
        exit 3
      else
        exit 4
      fi
    fi
    ;;
  verify-only)
    do_verify_only
    ;;
esac

exit 0