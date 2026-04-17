#!/bin/bash
set -e

echo ">>> Pulling latest code..."
git pull origin master

echo ">>> Building and starting containers..."
docker compose --env-file .env.production up -d --build

echo ">>> Waiting for postgres to be ready..."
sleep 5

echo ">>> Running database migrations..."
docker compose exec nextjs npx prisma migrate deploy

echo ">>> Deploy completado."
