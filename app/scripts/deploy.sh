#!/bin/bash

# Exit on any error
set -e

pnpm wrangler pages deploy ./build \
  --project-name huddle-app \
  --skip-caching