#!/bin/bash

# Start the e-commerce platform development servers

echo "🚀 Starting E-Commerce Platform Development Servers..."

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Port $1 is already in use. Please stop the service using port $1 and try again."
        exit 1
    fi
}

# Check if required ports are available
echo "🔍 Checking port availability..."
check_port 5000
check_port 3000

# Start backend server
echo "📦 Starting backend server on port 5000..."
cd backend
npm install
npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend server
echo "🎨 Starting frontend server on port 3000..."
cd ../e-palshop
npm install
npm run dev &
FRONTEND_PID=$!

echo "✅ Development servers started!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:5000"
echo "📚 API Health Check: http://localhost:5000/api/health"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping development servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait