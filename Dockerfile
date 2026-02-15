# 1. Base stage: Node version consistently use kora
FROM node:24-alpine AS base

# Install system dependencies (Sharp-er jonno libc6-compat dorkar hoy Alpine-e)
RUN apk add --no-cache libc6-compat

# 2. Dependencies stage
FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json* ./

# Sharp mismatch fix: libc6-compat install thaka obosthay 'npm ci' kora
# Eta docker environment-er jonno sothik binary download korbe
RUN npm ci

# 3. Builder stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time environment variables
ARG NEXT_PUBLIC_BASE_API
ARG NEXT_PUBLIC_ADMIN_EMAIL
ARG NEXT_PUBLIC_ADMIN_PASSWORD
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

ENV NEXT_PUBLIC_BASE_API=$NEXT_PUBLIC_BASE_API \
    NEXT_PUBLIC_ADMIN_EMAIL=$NEXT_PUBLIC_ADMIN_EMAIL \
    NEXT_PUBLIC_ADMIN_PASSWORD=$NEXT_PUBLIC_ADMIN_PASSWORD \
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY \
    NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# 4. Runner stage (Final light-weight image)
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Security update: non-root user use kora
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Standalone mode use korle shudhu dorkari file-gulo copy kora hoy
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000

# server.js standalone folder-e thake
CMD ["node", "server.js"]
