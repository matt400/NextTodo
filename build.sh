#!/bin/bash
set -e

APP_NAME="next-todo"
BLOB="next-todo.blob"

echo "▶ 1. Bundling application (client + server + blob)..."
npm run bundle

echo "▶ 2. Copying node (real path, not symlink)..."
cp $(readlink -f $(which node)) ./$APP_NAME

echo "▶ 3. Injecting blob..."
npx postject ./$APP_NAME NODE_SEA_BLOB ./$BLOB \
  --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2

echo "▶ 4. Setting permissions..."
chmod +x ./$APP_NAME

echo "✅ Done! Run: ./$APP_NAME"
