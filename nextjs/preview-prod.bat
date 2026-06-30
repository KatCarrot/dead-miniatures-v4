@echo off
REM ============================================================
REM  Dead Miniatures - прод-сборка + предпросмотр (Windows)
REM  Собирает оптимизированную версию (npm run build) и
REM  запускает её (npm start), затем открывает браузер.
REM  Это то, что реально уедет на Vercel.
REM ============================================================
setlocal
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo [!] Node.js не найден. Установите LTS с https://nodejs.org и запустите снова.
  pause
  exit /b 1
)

if not exist ".env.local" (
  copy ".env.local.example" ".env.local" >nul
  echo [i] Создан .env.local из примера - впишите ключи Supabase.
)

if not exist "node_modules" (
  echo [i] Устанавливаю зависимости...
  call npm install
  if errorlevel 1 ( pause & exit /b 1 )
)

echo [i] Собираю прод-версию...
call npm run build
if errorlevel 1 (
  echo [!] Сборка упала. Смотрите ошибки выше.
  pause
  exit /b 1
)

start "" /b cmd /c "timeout /t 3 >nul & start "" http://localhost:3000"
echo [i] Запускаю прод-сервер на http://localhost:3000 ...
call npm start

endlocal
