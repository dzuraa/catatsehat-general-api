#!/bin/sh

echo "Running entrypoint.sh"

# Load environment variables from .env file
if [ -f /app/.env ]; then
  echo "Sourcing environment variables from /app/.env..."
  export $(cat /app/.env | grep -v '^#' | xargs)
fi

echo "DATABASE_URL=$DATABASE_URL"

echo "Running migrations..."
pnpm db:migrate

echo "Starting the application..."
exec node dist/main.js
