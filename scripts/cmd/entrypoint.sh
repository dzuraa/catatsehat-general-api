#!/bin/sh

echo "Running entrypoint.sh"
echo "Running migrations..."

pnpm db:migrate

echo "Starting the application..."

node dist/main.js