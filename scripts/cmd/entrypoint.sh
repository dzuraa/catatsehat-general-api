#!/bin/sh

pnpm db:migrate
node dist/main.js