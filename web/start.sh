#!/bin/sh
set -e

echo "Resolving any failed migrations..."
node ./node_modules/prisma/build/index.js migrate resolve --applied 20260409000000_add_chat_models 2>/dev/null || true

echo "Running Prisma migrations..."
node ./node_modules/prisma/build/index.js migrate deploy

echo "Starting Next.js..."
exec node server.js
