@echo off
REM ============================================================
REM  Dead Miniatures - local startup (Windows)
REM  Double-click OR run from Rider terminal.
REM  Does: env file → install dependencies → dev server
REM        → opens http://localhost:3000 in browser.
REM ============================================================
setlocal
cd /d "%~dp0"

REM --- 1. Check Node.js ---
where node >nul 2>nul
if errorlevel 1 (
  echo [!] Node.js not found. Install LTS from https://nodejs.org and run again.
  pause
  exit /b 1
)

REM --- 2. env file (supabaseClient will fail to start without it) ---
if not exist ".env.local" (
  copy ".env.local.example" ".env.local" >nul
  echo [i] Created .env.local from example.
  echo     Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
  echo     or pages with data will be empty.
)

REM --- 3. Dependencies (install only if missing) ---
if not exist "node_modules" (
  echo [i] Installing dependencies, this is a one-time operation...
  call npm install
  if errorlevel 1 (
    echo [!] npm install failed.
    pause
    exit /b 1
  )
)

REM --- 4. Open browser after 4 sec (while dev server is starting) ---
start "" /b cmd /c "timeout /t 4 >nul & start "" http://localhost:3000"

REM --- 5. Dev server with hot-reload (Ctrl+C to stop) ---
echo [i] Starting dev server on http://localhost:3000...
call npm run dev

endlocal
