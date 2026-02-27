#!/usr/bin/env bash
set -euo pipefail

if [[ "${1:-}" == "" ]]; then
  echo "Usage: ./scripts/unlock-account.sh <email>"
  exit 1
fi

EMAIL="$1"
STORE_DIR="${RATE_LIMIT_STORE:-$(php -r 'echo sys_get_temp_dir() . DIRECTORY_SEPARATOR . "vaultpass_rate_limits";')}"

LOCK_KEY_HASH="$(php -r '$email = strtolower(trim($argv[1] ?? "")); echo hash("sha256", "lockout:" . "email:" . hash("sha256", $email));' "$EMAIL")"
LOCK_FILE="$STORE_DIR/$LOCK_KEY_HASH.json"

if [[ -f "$LOCK_FILE" ]]; then
  rm -f "$LOCK_FILE"
  echo "[unlock] Cleared lockout for $EMAIL"
else
  echo "[unlock] No lockout file found for $EMAIL"
fi
