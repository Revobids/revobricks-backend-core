#!/bin/bash
set -e  # Exit on any error

echo "Starting build process..."

# Install dependencies
echo "Installing dependencies..."
npm ci

# Clean and build
echo "Building application..."
npx @nestjs/cli build

# Verify build output
echo "Verifying build output..."
if [ ! -f "dist/main.js" ]; then
    echo "ERROR: dist/main.js not found!"
    echo "Contents of project root:"
    ls -la
    echo "Contents of dist folder (if exists):"
    ls -la dist/ || echo "dist folder not found"
    exit 1
fi

echo "Build verification successful!"
echo "Contents of dist folder:"
ls -la dist/

# Sync database schema
echo "Syncing database schema..."
npm run db:sync

echo "Build completed successfully!"