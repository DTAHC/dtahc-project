#!/bin/bash
echo "Stopping any running Next.js server..."
pkill -f "next dev" || true

echo "Clearing Next.js cache..."
rm -rf .next

echo "Clearing node_modules/.cache..."
rm -rf node_modules/.cache

echo "Starting the dev server..."
npm run dev