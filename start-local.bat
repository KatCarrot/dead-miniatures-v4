@echo off
REM ============================================================
REM  Dead Miniatures - локальный запуск (Windows)
REM  Двойной клик ИЛИ запуск из терминала Rider.
REM  Делает: env-файл -> установка зависимостей -> dev-сервер
REM          -> открывает http://localhost:3000 в браузере.
REM ============================================================
setlocal
cd /d "%~dp0"

REM --- 1. Проверка Node.js ---
where node >nul 2>nul
if errorlevel 1 (
  echo [!] Node.js не найден. Установите LTS с https://nodejs.org и запустите снова.
  pause
  exit /b 1
)

REM --- 2. env-файл (без него supabaseClient падает на старте) ---
if not exist ".env.local" (
  copy ".env.local.example" ".env.local" >nul
  echo [i] Создан .env.local из примера.
  echo     Впишите в него NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY,
  echo     иначе страницы с данными будут пустыми.
)

REM --- 3. Зависимости (ставим только если их нет) ---
if not exist "node_modules" (
  echo [i] Устанавливаю зависимости, это разовая операция...
  call npm install
  if errorlevel 1 (
    echo [!] npm install завершился с ошибкой.
    pause
    exit /b 1
  )
)

REM --- 4. Открыть браузер через 4 сек (пока поднимается dev-сервер) ---
start "" /b cmd /c "timeout /t 4 >nul & start "" http://localhost:3000"

REM --- 5. Dev-сервер с hot-reload (Ctrl+C для остановки) ---
echo [i] Запускаю dev-сервер на http://localhost:3000 ...
call npm run dev

endlocal
