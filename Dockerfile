FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
COPY prisma ./prisma/
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

#
ENV DATABASE_URL="postgresql://dummy:dummy@dummy:5432/dummy?schema=public"
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_ZXF1YWwtc3BpZGVyLTkxLmNsZXJrLmFjY291bnRzLmRldiQ"
ENV CLERK_SECRET_KEY="sk_test_dummy"

# Prisma generate
RUN npx prisma generate

# Build
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

USER nextjs

EXPOSE 10000

ENV HOSTNAME="0.0.0.0"

CMD ["npm", "run", "start"]