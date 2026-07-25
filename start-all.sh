#!/bin/bash

echo "Starting all services for Flocksy..."

# Trap CTRL+C to kill all background processes
trap "echo 'Stopping all services...'; trap - SIGTERM && kill -- -$$" SIGINT SIGTERM EXIT

# Start backend
echo "-> Starting Backend (Port 8080)..."
cd backend
npm install
npm run dev &
cd ..

# Start frontend 
echo "-> Starting Frontend..."
cd frontend
npm install
npm run dev &
cd ..

# Start ai-core
echo "-> Starting AI Core (Port 8000)..."
cd ai-core
if [ ! -d ".venv" ]; then
    python3 -m venv .venv
fi
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000 &
deactivate
cd ..

# Start MCP Services
echo "-> Starting MCP Services..."

# Disease MCP
echo "  -> Disease MCP (Port 8101)..."
cd mcp-services/disease_mcp
if [ ! -d ".venv" ]; then
    python3 -m venv .venv
fi
source .venv/bin/activate
pip install -r requirements.txt
python3 -m uvicorn app.main:app --port 8101 &
deactivate
cd ../../

# Medicine MCP
echo "  -> Medicine MCP (Port 8102)..."
cd mcp-services/medicine_mcp
if [ ! -d ".venv" ]; then
    python3 -m venv .venv
fi
source .venv/bin/activate
pip install -r requirements.txt
python3 -m uvicorn app.main:app --port 8102 &
deactivate
cd ../../

# Feed MCP
echo "  -> Feed MCP (Port 8103)..."
cd mcp-services/feed_mcp
if [ ! -d ".venv" ]; then
    python3 -m venv .venv
fi
source .venv/bin/activate
pip install -r requirements.txt
python3 -m uvicorn app.main:app --port 8103 &
deactivate
cd ../../

# Environment MCP
echo "  -> Environment MCP (Port 8104)..."
cd mcp-services/environment_mcp
if [ ! -d ".venv" ]; then
    python3 -m venv .venv
fi
source .venv/bin/activate
pip install -r requirements.txt
python3 -m uvicorn app.main:app --port 8104 &
deactivate
cd ../../

# Safety MCP
echo "  -> Safety MCP (Port 8105)..."
cd mcp-services/safety_mcp
if [ ! -d ".venv" ]; then
    python3 -m venv .venv
fi
source .venv/bin/activate
pip install -r requirements.txt
python3 -m uvicorn app.main:app --port 8105 &
deactivate
cd ../../

# Memory MCP
echo "  -> Memory MCP (Port 8106)..."
cd mcp-services/memory_mcp
if [ ! -d ".venv" ]; then
    python3 -m venv .venv
fi
source .venv/bin/activate
pip install -r requirements.txt
python3 -m uvicorn app.main:app --port 8106 &
deactivate
cd ../../

echo ""
echo "================================================="
echo "All services have been started in the background."
echo "Press CTRL+C to stop all services."
echo "================================================="

# Wait indefinitely so the script doesn't exit and kill the background tasks
wait
