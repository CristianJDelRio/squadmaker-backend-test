FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

# Dummy DATABASE_URL for prisma generate (real URL comes at runtime)
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" pnpm db:generate

RUN pnpm build

# Prune dev dependencies, keeping only production deps
RUN pnpm prune --prod --ignore-scripts

FROM node:20-alpine AS production

WORKDIR /app

# Copy package files
COPY --from=builder /app/package.json ./package.json

# Copy pruned node_modules (production only)
COPY --from=builder /app/node_modules ./node_modules

# Copy built application
COPY --from=builder /app/dist ./dist

# Copy Prisma files for migrations
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
