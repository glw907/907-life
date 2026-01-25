#!/usr/bin/env bash
# Build script for 907.life Hugo site on Cloudflare Workers
# Downloads a specific Hugo version to ensure consistent builds

set -euo pipefail

# Configuration
HUGO_VERSION="${HUGO_VERSION:-0.123.7}"
export TZ=UTC

echo "Starting Hugo build process..."
echo "Hugo version: ${HUGO_VERSION}"

# Download Hugo extended (required for SCSS support, even if not used)
echo "Downloading Hugo ${HUGO_VERSION}..."
curl -sLO "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.tar.gz"

# Extract Hugo binary
echo "Extracting Hugo..."
tar -xf "hugo_extended_${HUGO_VERSION}_linux-amd64.tar.gz"

# Move to a directory in PATH
mkdir -p /opt/buildhome
cp hugo /opt/buildhome/
export PATH="/opt/buildhome:$PATH"

# Clean up downloaded files
rm -f LICENSE README.md "hugo_extended_${HUGO_VERSION}_linux-amd64.tar.gz"

# Verify Hugo installation
echo "Hugo version check:"
hugo version

# Build the site
echo "Building site..."
hugo --gc --minify

echo "Build completed successfully!"
echo "Output directory: ./public"
