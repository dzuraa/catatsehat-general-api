# Stage 1: Base image
FROM node:22-alpine AS base

# ENV
ENV PNPM_HOME="/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"

# Install necessary tools & pnpm
RUN apk add --no-cache curl openssl \
    && corepack enable \
    && corepack prepare pnpm@9.5.0 --activate

WORKDIR /app

# Stage 2: Dependencies
FROM base AS dependencies

WORKDIR /app

COPY package.json pnpm-lock.yaml prisma ./

RUN pnpm install --frozen-lockfile \
    && pnpm prisma generate

# Stage 3: Build
FROM base AS build

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

RUN pnpm build

# Stage 4: Deploy (Final Image)
FROM node:22-alpine AS deploy

WORKDIR /app

# Copy only needed files
COPY --from=build /app/dist ./dist
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=base /app/package.json ./package.json
COPY --from=dependencies /app/prisma ./prisma

EXPOSE 3000

ENTRYPOINT ["node", "dist/main.js"]

# FROM node:22-slim AS base

# # ENV
# ENV PNPM_HOME="/pnpm"
# ENV PATH="${PNPM_HOME}:${PATH}"

# # Install added package
# RUN apt-get update && apt-get install -y \
#     openssl \
#     ca-certificates \
#     curl \
#     && corepack enable \
#     && corepack prepare pnpm@9.5.0 --activate \
#     && rm -rf /var/lib/apt/lists/*

# # Workdir
# WORKDIR /app

# # Copy all result
# COPY . .

# # Stage 2 Install Dependencies
# FROM base AS dependencies

# # Workdir
# WORKDIR /app

# # Copy package
# COPY package.json pnpm-lock.yaml prisma ./

# # Install Dependencies
# RUN pnpm install --frozen-lockfile

# # Generate Prisma Migration
# RUN pnpm prisma generate

# # Stage 2 Copy Build
# FROM base AS build

# WORKDIR /app

# # Copy Node Module
# COPY --from=dependencies /app/node_modules ./node_modules

# # Copy all
# COPY . .

# # Build
# RUN pnpm build

# # Stage 3 Deploy
# FROM base AS deploy

# # Workdir
# WORKDIR /app

# # Copy dependencies from build stage
# COPY --from=build /app/dist ./dist
# COPY --from=dependencies /app/node_modules ./node_modules
# COPY --from=base /app/package.json ./
# COPY --from=base /app/prisma ./prisma

# EXPOSE 3000

# ENTRYPOINT ["node", "dist/main.js"]
