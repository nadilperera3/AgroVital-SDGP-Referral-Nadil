#!/bin/bash
# Script to launch the complete backend system in production mode

# Stop any existing processes
echo "Stopping any existing services..."
pkill -f "python app.py" || true
pkill -f "node server.js" || true

# Go to project directory
cd /mnt/c/Users/ASUS/Desktop/Ml\ done/Backend_AgroVital

# Start Flask API in production mode
echo "Starting Flask API in production mode..."
cd flask-api
source venv/bin/activate

# Load environment variables
export DEVELOPMENT_MODE=false
export PORT=5001
export BINARY_MODEL_PATH=models/binary_model.h5
export DISEASE_MODEL_PATH=models/disease_model.h5

# Start Flask API in background
python app.py > flask_api.log 2>&1 &
FLASK_PID=$!
cd ..

# Wait for Flask API to start
echo "Waiting for Flask API to start..."
sleep 10

# Start Node.js backend
echo "Starting Node.js backend..."
cd node-backend
export NODE_ENV=production
export ML_API_URL=http://localhost:5001
node server.js > node_backend.log 2>&1 &
NODE_PID=$!
cd ..

echo "Production backend is running!"
echo "Flask API (PID: $FLASK_PID) is running on port 5001"
echo "Node.js backend (PID: $NODE_PID) is running on port 5000"
echo "Logs are available in flask_api.log and node_backend.log"
echo "Press Ctrl+C to stop all services"

# Wait for Ctrl+C
trap "kill $FLASK_PID $NODE_PID; echo 'Stopped all services.'; exit" INT TERM
wait