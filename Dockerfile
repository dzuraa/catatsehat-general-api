# Base image dengan corepack (pnpm) dan folder struktur dasar
FROM node:22-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"
ENV APP_PORT=3000

RUN apk add --no-cache openssl
RUN corepack enable

WORKDIR /app
COPY . .

# Dependencies Layer
FROM base AS dependencies

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store pnpm install --frozen-lockfile

# Build Layer
FROM base AS build

WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
RUN pnpm build

# Deploy Layer
FROM node:22-alpine AS deploy

ENV PNPM_HOME="/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"
ENV APP_PORT=3000

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=base /app/package.json ./
COPY --from=base /app/prisma ./prisma

EXPOSE 3000

CMD ["node", "dist/main.js"]
