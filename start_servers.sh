#!/bin/bash

echo "========================================"
echo "SmartPest - Starting Development Servers"
echo "========================================"
echo

echo "Starting Backend Server..."
echo
cd smartpest_backend
gnome-terminal --title="SmartPest Backend" -- bash -c "python start_server.py; exec bash" &
echo "Backend server starting on http://localhost:8000"
echo

echo "Starting Frontend Server..."
echo
cd ../frontend-react
gnome-terminal --title="SmartPest Frontend" -- bash -c "npm run dev; exec bash" &
echo "Frontend server starting on http://localhost:5173"
echo

echo "========================================"
echo "Both servers are starting..."
echo
echo "Backend:  http://localhost:8000"
echo "Frontend: http://localhost:5173"
echo
echo "Check the terminal windows for server status"
echo "========================================" 