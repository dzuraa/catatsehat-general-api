# Base image 
FROM node:22-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"
ENV APP_PORT=3000

RUN apk add --no-cache openssl
RUN corepack enable

WORKDIR /app
COPY . .

# Dependencies Layer (install dependencies + generate Prisma Client)
FROM base AS dependencies

WORKDIR /app
COPY package.json pnpm-lock.yaml prisma ./ 
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm prisma generate  # generate Prisma Client dengan binaryTarget linux-musl

# Build Layer
FROM base AS build

WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/prisma ./prisma
COPY . .
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
