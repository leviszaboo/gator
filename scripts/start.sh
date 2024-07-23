#!/usr/bin/env bash
# scripts/toggle.sh

if [ -f apps-api/.env ]; then
  export $(grep -v '^#' apps-api/.env | xargs)
else
  echo "Error: apps-api/.env file not found."
  exit 1
fi

if [ -z "$POSTGRES_PASSWORD" ]; then
  echo "Error: POSTGRES_PASSWORD is not set in the apps-api/.env file."
  exit 1
fi

# Run Docker Compose
docker-compose up -d