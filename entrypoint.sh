#!/bin/bash

# Start the FastAPI backend
echo "Starting backend..."
cd /app/backend && uvicorn app.main:app --host 0.0.0.0 --port 8000 &

# Start the Next.js frontend
echo "Starting frontend..."
cd /app/frontend && npm start -- -p 3000

# Wait for any process to exit
wait -n

# Exit with status of process that exited first
exit $?
