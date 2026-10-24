@echo off
chcp 65001 > nul
echo ============================================================
echo   お父さんのお笑いシアター（外部公開リンク起動）
echo ============================================================

cd /d "%~dp0"

echo 1. アプリサーバーを起動中...
start "お笑いシアターサーバー" cmd /c "node server.js"

timeout /t 2 > nul

echo 2. iPad・スマホ接続用の公開リンクを作成中...
echo （数秒後に画面に「https://xxxx.trycloudflare.com」が表示されます）
echo ------------------------------------------------------------
npx cloudflared tunnel --url http://localhost:3001

pause
