#!/bin/bash
set -e

echo ">>> Pulling latest code..."
git pull origin master

echo ">>> Building and starting containers..."
docker compose --env-file .env.production up -d --build

echo ">>> Deploy completado. (migraciones corren automáticamente al iniciar el contenedor)"
