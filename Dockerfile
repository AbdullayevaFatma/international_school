# Use Node.js as the base image
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
COPY prisma ./prisma/

RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Dummy DATABASE_URL for Prisma generate
ENV DATABASE_URL="postgresql://dummy:dummy@dummy:5432/dummy?schema=public"

# Clerk test keys for build
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_Y2xlcmsuaW5jbHVkZWQua2F0eWRpZC05Mi5sY2wuZGV2JA"
ENV CLERK_SECRET_KEY="sk_test_example"

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy files with correct permissions
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

USER nextjs

EXPOSE 10000


ENV HOSTNAME="0.0.0.0"

CMD ["npm", "run", "start"]