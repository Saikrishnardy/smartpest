@echo off
echo ========================================
echo SmartPest - Starting Development Servers
echo ========================================
echo.

echo Starting Backend Server...
echo.
cd smartpest_backend
start "SmartPest Backend" cmd /k "python start_server.py"
echo Backend server starting on http://localhost:8000
echo.

echo Starting Frontend Server...
echo.
cd ..\frontend-react
start "SmartPest Frontend" cmd /k "npm run dev"
echo Frontend server starting on http://localhost:5173
echo.

echo ========================================
echo Both servers are starting...
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo Press any key to close this window
echo ========================================
pause 