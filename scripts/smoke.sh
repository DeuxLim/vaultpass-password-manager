#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-http://localhost:8000}"

echo "[smoke] Using base URL: $BASE_URL"

tmp_cookie="$(mktemp)"
cleanup() {
  rm -f "$tmp_cookie"
}
trap cleanup EXIT

check_status() {
  local url="$1"
  local expected="$2"
  local method="${3:-GET}"
  local headers="${4:-}"
  local body="${5:-}"

  local code
  if [[ -n "$body" ]]; then
    code="$(curl -s -o /dev/null -w '%{http_code}' -X "$method" -b "$tmp_cookie" -c "$tmp_cookie" -H 'Content-Type: application/json' $headers --data "$body" "$url")"
  else
    code="$(curl -s -o /dev/null -w '%{http_code}' -X "$method" -b "$tmp_cookie" -c "$tmp_cookie" $headers "$url")"
  fi

  if [[ "$code" != "$expected" ]]; then
    echo "[smoke] FAIL $method $url expected=$expected actual=$code"
    exit 1
  fi
  echo "[smoke] ok   $method $url -> $code"
}

check_status "$BASE_URL/api/auth/csrf.php" "200"
check_status "$BASE_URL/api/auth/session.php" "200"
check_status "$BASE_URL/api/vault/list.php" "401"
check_status "$BASE_URL/api/auth/login.php" "422" "POST" "" '{"email":"bad","password":""}'

echo "[smoke] completed"
