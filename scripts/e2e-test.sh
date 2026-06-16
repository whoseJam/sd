#!/usr/bin/env bash
# End-to-end smoke test: pack every workspace package, install them into a
# fresh consumer project, run sd-init, build a deck. Verifies the
# publishable shape works against real node_modules (not just symlinks).

set -euo pipefail

ROOT=$(cd "$(dirname "$0")/.." && pwd)
PACK_DIR=/tmp/sd-pack
CONSUMER_DIR=/tmp/sd-e2e-consumer
DECK_DIR=/tmp/sd-e2e-deck

rm -rf "$PACK_DIR" "$CONSUMER_DIR" "$DECK_DIR"
mkdir -p "$PACK_DIR"

PKGS=(core layout sd element include-html reveal webslides impress assets cli)

echo "[1/6] Packing..."
for p in "${PKGS[@]}"; do
  (cd "$ROOT/packages/$p" && pnpm pack --pack-destination "$PACK_DIR" >/dev/null)
done

echo "[2/6] Building consumer project at $CONSUMER_DIR..."
mkdir -p "$CONSUMER_DIR"
cd "$CONSUMER_DIR"

# Use pnpm overrides so transitive @whosejam/* refs (the workspace:*
# specs are rewritten to ^0.0.1 inside packed tarballs, which would
# otherwise try the npm registry and fail since nothing is published).
cat > package.json <<JSON
{
  "name": "sd-e2e-consumer",
  "version": "0.0.0",
  "private": true,
  "dependencies": {
    "@whosejam/sd": "file:$PACK_DIR/whosejam-sd-0.0.1.tgz",
    "@whosejam/sd-cli": "file:$PACK_DIR/whosejam-sd-cli-0.0.1.tgz"
  },
  "pnpm": {
    "overrides": {
      "@whosejam/sd": "file:$PACK_DIR/whosejam-sd-0.0.1.tgz",
      "@whosejam/sd-assets": "file:$PACK_DIR/whosejam-sd-assets-0.0.1.tgz",
      "@whosejam/sd-cli": "file:$PACK_DIR/whosejam-sd-cli-0.0.1.tgz",
      "@whosejam/sd-core": "file:$PACK_DIR/whosejam-sd-core-0.0.1.tgz",
      "@whosejam/sd-element": "file:$PACK_DIR/whosejam-sd-element-0.0.1.tgz",
      "@whosejam/sd-impress": "file:$PACK_DIR/whosejam-sd-impress-0.0.1.tgz",
      "@whosejam/sd-include-html": "file:$PACK_DIR/whosejam-sd-include-html-0.0.1.tgz",
      "@whosejam/sd-layout": "file:$PACK_DIR/whosejam-sd-layout-0.0.1.tgz",
      "@whosejam/sd-reveal": "file:$PACK_DIR/whosejam-sd-reveal-0.0.1.tgz",
      "@whosejam/sd-webslides": "file:$PACK_DIR/whosejam-sd-webslides-0.0.1.tgz"
    }
  }
}
JSON

cat > .npmrc <<NPMRC
public-hoist-pattern[]=*-loader
public-hoist-pattern[]=*-webpack-plugin
public-hoist-pattern[]=webpack
public-hoist-pattern[]=webpack-stream
NPMRC

pnpm install --silent 2>&1 | tail -3

echo "[3/6] Running sd-init from installed cli..."
./node_modules/.bin/sd-init "$DECK_DIR" --no-install >/dev/null

echo "[4/6] Patching scaffolded package.json to use the same file: tarballs..."
node -e "
const fs = require('node:fs');
const path = '$DECK_DIR/package.json';
const p = JSON.parse(fs.readFileSync(path, 'utf-8'));
p.dependencies = p.dependencies || {};
p.dependencies['@whosejam/sd'] = 'file:$PACK_DIR/whosejam-sd-0.0.1.tgz';
p.dependencies['@whosejam/sd-cli'] = 'file:$PACK_DIR/whosejam-sd-cli-0.0.1.tgz';
p.pnpm = {
  overrides: {
    '@whosejam/sd': 'file:$PACK_DIR/whosejam-sd-0.0.1.tgz',
    '@whosejam/sd-assets': 'file:$PACK_DIR/whosejam-sd-assets-0.0.1.tgz',
    '@whosejam/sd-cli': 'file:$PACK_DIR/whosejam-sd-cli-0.0.1.tgz',
    '@whosejam/sd-core': 'file:$PACK_DIR/whosejam-sd-core-0.0.1.tgz',
    '@whosejam/sd-element': 'file:$PACK_DIR/whosejam-sd-element-0.0.1.tgz',
    '@whosejam/sd-impress': 'file:$PACK_DIR/whosejam-sd-impress-0.0.1.tgz',
    '@whosejam/sd-include-html': 'file:$PACK_DIR/whosejam-sd-include-html-0.0.1.tgz',
    '@whosejam/sd-layout': 'file:$PACK_DIR/whosejam-sd-layout-0.0.1.tgz',
    '@whosejam/sd-reveal': 'file:$PACK_DIR/whosejam-sd-reveal-0.0.1.tgz',
    '@whosejam/sd-webslides': 'file:$PACK_DIR/whosejam-sd-webslides-0.0.1.tgz'
  }
};
fs.writeFileSync(path, JSON.stringify(p, null, 2));
"

echo "[5/6] Installing scaffolded project..."
cd "$DECK_DIR"
cp "$CONSUMER_DIR/.npmrc" .
pnpm install --silent 2>&1 | tail -3

echo "[6/6] Building hello deck via gulp sd + animation-group..."
pnpm exec gulp sd -o dist 2>&1 | tail -2
pnpm exec gulp animation-group -i decks/hello/animation -o dist 2>&1 | tail -2

echo ""
echo "=== verification ==="
echo "sd.js:        $(test -f dist/sd.js && echo ok || echo MISSING)"
echo "intro.js:     $(test -f dist/intro.js && echo ok || echo MISSING)"
echo "intro.html:   $(test -f dist/intro.html && echo ok || echo MISSING)"
echo "vendor/:      $(test -d dist/vendor && echo $(ls dist/vendor | wc -l | tr -d ' ') files || echo MISSING)"
echo "sd-init bin:  $(test -f ./node_modules/.bin/sd-init && echo ok || echo MISSING)"
echo ""
echo "✓ E2E passed; tarballs at $PACK_DIR, scaffold at $DECK_DIR"
