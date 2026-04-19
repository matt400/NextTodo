$ErrorActionPreference = "Stop"

$APP_NAME = "next-todo.exe"
$BLOB = "next-todo.blob"

Write-Host "▶ 1. Copying node.exe (real path, not symlink)..."
$nodePath = (Get-Item (Get-Command node).Source).Target
if (-not $nodePath) {
    $nodePath = (Get-Command node).Source
}
Copy-Item $nodePath -Destination $APP_NAME -Force

# ▶ Remove signature — uncomment if you get error 0xc0000022
# signtool remove /s $APP_NAME

Write-Host "▶ 2. Injecting blob..."
$fuse = "NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2"
& npx postject $APP_NAME NODE_SEA_BLOB $BLOB --sentinel-fuse $fuse

Write-Host "✅ Done! Run: .\$APP_NAME"
