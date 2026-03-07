#!/usr/bin/env bash
# Build script for 907.life Hugo site on Cloudflare Workers
# Downloads a specific Hugo version to ensure consistent builds

set -euo pipefail

# Configuration
HUGO_VERSION="${HUGO_VERSION:-0.147.0}"
export TZ=UTC

echo "Starting Hugo build process..."
echo "Hugo version: ${HUGO_VERSION}"

# Download Hugo extended (required for SCSS support, even if not used)
echo "Downloading Hugo ${HUGO_VERSION}..."
HUGO_TARBALL="hugo_extended_${HUGO_VERSION}_linux-amd64.tar.gz"
curl -sLO "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/${HUGO_TARBALL}"

# Extract Hugo binary into a temp dir to avoid clobbering project files
echo "Extracting Hugo..."
HUGO_TMP=$(mktemp -d)
tar -xf "${HUGO_TARBALL}" -C "${HUGO_TMP}"
rm -f "${HUGO_TARBALL}"

# Move to a directory in PATH
# Use /opt/buildhome in Cloudflare environment, local .bin directory otherwise
if mkdir -p /opt/buildhome 2>/dev/null; then
  cp "${HUGO_TMP}/hugo" /opt/buildhome/
  export PATH="/opt/buildhome:$PATH"
else
  mkdir -p .bin
  cp "${HUGO_TMP}/hugo" .bin/
  export PATH="$(pwd)/.bin:$PATH"
fi

# Clean up temp dir
rm -rf "${HUGO_TMP}"

# Verify Hugo installation
echo "Hugo version check:"
hugo version

# Build the site
echo "Building site..."
hugo --gc --minify

echo "Build completed successfully!"
echo "Output directory: ./public"
