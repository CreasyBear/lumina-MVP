#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Load environment variables from .env file
if [ -f .env ]; then
    export $(cat .env | grep -v '#' | awk '/=/ {print $1}')
fi

# Check for required environment variables
if [ -z "$DATABASE_URL" ] || [ -z "$SECRET_KEY" ]; then
    echo "Error: DATABASE_URL and SECRET_KEY must be set in .env file"
    exit 1
fi

# Navigate to the project directory
cd /path/to/your/project

# Pull the latest changes
git pull origin main

# Backend setup
cd lumina-backend

# Install backend dependencies
pip install -r requirements.lock

# Run database migrations (if using Alembic)
alembic upgrade head

# Start the backend server
nohup uvicorn main:app --host 0.0.0.0 --port 8000 &

# Frontend setup
cd ../lumina-frontend

# Install frontend dependencies
npm install

# Build the frontend
npm run build

# Start the frontend server (assuming you're using a Node.js server for production)
nohup npm start &

echo "Deployment completed successfully!"