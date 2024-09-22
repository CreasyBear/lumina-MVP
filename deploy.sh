#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Load environment variables from .env file
if [ -f .env ]; then
    export $(cat .env | grep -v '#' | awk '/=/ {print $1}')
fi

# Check for required environment variables
if [ -z "$DIGITALOCEAN_ACCESS_TOKEN" ] || [ -z "$APP_ID" ] || [ -z "$DROPLET_IP" ] || [ -z "$DROPLET_SSH_KEY" ]; then
    echo "Error: DIGITALOCEAN_ACCESS_TOKEN, APP_ID, DROPLET_IP, and DROPLET_SSH_KEY must be set in .env file"
    exit 1
fi

# Build the Docker image
echo "Building Docker image..."
docker build -t lumina-backend:latest lumina-backend

# Tag the image for DigitalOcean Container Registry
echo "Tagging Docker image..."
docker tag lumina-backend:latest registry.digitalocean.com/lumina/lumina-backend:latest

# Push the image to DigitalOcean Container Registry
echo "Pushing Docker image to DigitalOcean Container Registry..."
docker push registry.digitalocean.com/lumina/lumina-backend:latest

# Deploy to the Droplet
echo "Deploying to Droplet..."
ssh -i "$DROPLET_SSH_KEY" root@"$DROPLET_IP" << EOF
    docker pull registry.digitalocean.com/lumina/lumina-backend:latest
    docker stop lumina-backend || true
    docker rm lumina-backend || true
    docker run -d --name lumina-backend -p 8000:8000 \
        -e HOST=0.0.0.0 \
        -e PORT=8000 \
        -e DATABASE_URL=${DATABASE_URL} \
        -e SECRET_KEY=${SECRET_KEY} \
        registry.digitalocean.com/lumina/lumina-backend:latest
EOF

echo "Deployment completed successfully!"