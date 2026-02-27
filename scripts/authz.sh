#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-http://localhost:8000}"

echo "[authz] Using base URL: $BASE_URL"

tmp_cookie="$(mktemp)"
cleanup() {
  rm -f "$tmp_cookie"
}
trap cleanup EXIT

fetch_csrf_token() {
  curl -s -b "$tmp_cookie" -c "$tmp_cookie" "$BASE_URL/api/auth/csrf.php" \
    | php -r '$d = json_decode(stream_get_contents(STDIN), true); echo is_array($d) ? ($d["csrf_token"] ?? "") : "";'
}

request_code() {
  local method="$1"
  local path="$2"
  local expected="$3"
  local body="${4:-}"
  local csrf="${5:-}"

  local args=(
    -s -o /dev/null -w '%{http_code}'
    -X "$method"
    -b "$tmp_cookie"
    -c "$tmp_cookie"
  )

  if [[ -n "$csrf" ]]; then
    args+=(-H "X-CSRF-Token: $csrf")
  fi
  if [[ -n "$body" ]]; then
    args+=(-H 'Content-Type: application/json' --data "$body")
  fi

  local code
  code="$(curl "${args[@]}" "$BASE_URL$path")"
  local matched=0
  IFS='|' read -r -a expected_codes <<< "$expected"
  for expected_code in "${expected_codes[@]}"; do
    if [[ "$code" == "$expected_code" ]]; then
      matched=1
      break
    fi
  done

  if [[ "$matched" -ne 1 ]]; then
    echo "[authz] FAIL $method $path expected=$expected actual=$code"
    exit 1
  fi
  echo "[authz] ok   $method $path -> $code"
}

csrf_token="$(fetch_csrf_token)"
if [[ -z "$csrf_token" ]]; then
  echo "[authz] FAIL unable to fetch CSRF token"
  exit 1
fi

# Public/session bootstrap endpoints.
request_code GET /api/auth/csrf.php 200
request_code GET /api/auth/session.php 200

# Public auth flows should reject malformed payloads (not unauthorized).
request_code POST /api/auth/login.php "422|429" '{"email":"bad","password":""}' "$csrf_token"
request_code POST /api/auth/register.php "422|429" '{"name":"","email":"bad","password":"123"}' "$csrf_token"
request_code POST /api/auth/2fa-verify-login.php 401 '{"code":"000000"}' "$csrf_token"

# Auth-protected GET endpoints.
for path in \
  /api/auth/sessions.php \
  /api/auth/2fa-status.php \
  /api/auth/key-material.php \
  /api/auth/security-events.php \
  /api/emergency-access/list.php \
  /api/shared-vault/list.php \
  /api/shared-vault/invitations.php \
  /api/shared-vault/members.php?vault_id=1 \
  /api/vault/list.php \
  /api/vault/list-versions.php?item_id=1
do
  request_code GET "$path" 401
done

# Auth-protected mutating endpoints (CSRF valid, session unauthenticated).
for path in \
  /api/auth/revoke-session.php \
  /api/auth/revoke-other-sessions.php \
  /api/auth/2fa-setup.php \
  /api/auth/2fa-enable.php \
  /api/auth/2fa-disable.php \
  /api/auth/key-material-save.php \
  /api/emergency-access/grant.php \
  /api/emergency-access/revoke.php \
  /api/emergency-access/request.php \
  /api/emergency-access/cancel-request.php \
  /api/emergency-access/decide.php \
  /api/shared-vault/create.php \
  /api/shared-vault/update.php \
  /api/shared-vault/delete.php \
  /api/shared-vault/invite.php \
  /api/shared-vault/respond-invite.php \
  /api/shared-vault/update-member-role.php \
  /api/shared-vault/transfer-ownership.php \
  /api/shared-vault/remove-member.php \
  /api/vault/create.php \
  /api/vault/update.php \
  /api/vault/delete.php \
  /api/vault/export.php \
  /api/vault/import-backup.php \
  /api/vault/import-csv.php \
  /api/vault/restore-version.php \
  /api/vault/toggle-favorite.php
do
  request_code POST "$path" 401 '{}' "$csrf_token"
done

echo "[authz] completed"
