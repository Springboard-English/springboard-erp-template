#!/usr/bin/env bash
#
# Roll an app's live SPA back to a previously published commit. Run from the
# app's root; the app id, bucket and base path come from `springboardBootstrap`
# in its package.json. BUCKET and PREFIX in the environment override them.
#
# Assets are content-hashed and never deleted, so every archived index.html
# still points at chunks that exist. Rolling back therefore means re-stamping
# the live bootstrap with another control sha — its variants are kept — and no
# rebuild. It takes effect on the next page load: index.html is `no-store`.
#
#   npx sb-rollback              # list what can be rolled back to
#   npx sb-rollback <commit-sha> # make that release the live control
#
set -euo pipefail

# The real directory, not node_modules/.bin, which holds only the symlink.
HERE="$(dirname "$(readlink -f "$0")")"

{ read -r APP; read -r CONFIG_BUCKET; read -r CONFIG_PREFIX; } \
  < <(node "${HERE}/lib/bootstrap-config.mjs" --shell) || true
# A failed config read has already said why on stderr; `set -e` cannot see it.
[ -n "${APP:-}" ] && [ -n "${CONFIG_BUCKET:-}" ] || exit 1
BUCKET="${BUCKET:-${CONFIG_BUCKET}}"
PREFIX="${PREFIX:-${CONFIG_PREFIX}}"

# An app at the bucket root has no prefix segment. Building BASE by
# concatenation would then yield `gs://bucket//releases/...`, and GCS treats a
# doubled slash as a real (different) object path rather than normalising it.
if [ -n "${PREFIX}" ]; then
  BASE="gs://${BUCKET}/${PREFIX}"
else
  BASE="gs://${BUCKET}"
fi

if [ $# -eq 0 ]; then
  echo "Releases available in ${BASE}/releases (newest last):"
  echo
  # Sorted by upload time, not by SHA — a hash tells you nothing about order.
  gcloud storage ls --long "${BASE}/releases/*/index.html" 2>/dev/null \
    | awk '/index\.html$/ { n = split($NF, p, "/"); printf "  %s  %s\n", $2, p[n-1] }' \
    | sort
  echo
  echo "Currently live (the bootstrap's release map):"
  gcloud storage cat "${BASE}/index.html" 2>/dev/null \
    | grep -o "<script type=\"application/json\" id=\"${APP}-releases\">[^<]*" \
    | sed 's/^.*>/  /'
  echo
  echo "Usage: $0 <commit-sha>"
  exit 0
fi

SHA="$1"
SOURCE="${BASE}/releases/${SHA}/index.html"

# Check before copying: a typo would otherwise fail *after* we had already
# decided to change what users are served.
if ! gcloud storage ls "${SOURCE}" >/dev/null 2>&1; then
  echo "No release archived at ${SOURCE}" >&2
  echo "Run '$0' with no arguments to list what is available." >&2
  exit 1
fi

WORK="$(mktemp -d)"
trap 'rm -rf "${WORK}"' EXIT
gcloud storage cp "${BASE}/index.html" "${WORK}/live.html" >/dev/null
node "${HERE}/stamp-bootstrap.mjs" \
  --control "${SHA}" --from "${WORK}/live.html" --out "${WORK}/index.html"

echo "Making ${SHA} the live control on ${BASE}/index.html"
gcloud storage cp "${WORK}/index.html" "${BASE}/index.html" \
  --cache-control="no-store, max-age=0"

echo "Done. index.html is served no-store, so this is live on the next load."
echo "The rolled-back build's assets were never deleted, so nothing else is needed."
