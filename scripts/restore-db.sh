#!/usr/bin/env bash
set -euo pipefail

in_path="${1:-}"
if [[ -z "$in_path" ]]; then
  echo "usage: $0 <input.sql>"
  exit 2
fi

if [[ ! -f "$in_path" ]]; then
  echo "[restore] Input file not found: $in_path"
  exit 2
fi

DB_HOST="${DB_HOST:-127.0.0.1}"
DB_PORT="${DB_PORT:-3306}"
DB_NAME="${DB_NAME:-}"
DB_USER="${DB_USER:-}"
DB_PASS="${DB_PASS:-}"

if [[ -z "$DB_NAME" || -z "$DB_USER" ]]; then
  echo "[restore] Missing DB_NAME/DB_USER env vars (see .env.example)"
  exit 2
fi

echo "[restore] Restoring $in_path -> $DB_NAME"
echo "[restore] WARNING: This may overwrite data in the target database."

mysql \
  --host="$DB_HOST" \
  --port="$DB_PORT" \
  --user="$DB_USER" \
  --password="$DB_PASS" "$DB_NAME" < "$in_path"

echo "[restore] Done"

