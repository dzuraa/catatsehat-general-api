FROM node:22-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"
ENV APP_PORT=3000

RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    curl \
    && corepack enable \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . .

FROM base AS dependencies
WORKDIR /app
COPY package.json pnpm-lock.yaml prisma ./
RUN pnpm install --frozen-lockfile
RUN pnpm prisma generate

FROM base AS build
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM base AS deploy
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=base /app/package.json ./
COPY --from=base /app/prisma ./prisma

EXPOSE 3000
CMD ["node", "dist/main.js"]
