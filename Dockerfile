# Build stage
FROM oven/bun:latest AS builder

WORKDIR /app

# Copy package files
COPY package.json bun.lockb* ./

# Install dependencies with bun
RUN bun install --frozen-lockfile

# Copy entire app
COPY . .

# Generate Prisma client
RUN bunx prisma generate

# Build Next.js app
RUN bun run build

# Production stage
FROM oven/bun:latest

WORKDIR /app

# Install dumb-init to handle signals properly
RUN apt-get update && apt-get install -y dumb-init && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json bun.lockb* ./

# Install production dependencies only
RUN bun install --frozen-lockfile --production

# Copy built app from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/public ./public

# Copy necessary files
COPY next.config.mjs ./
COPY tsconfig.json ./

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production

# Use dumb-init to handle signals
ENTRYPOINT ["dumb-init", "--"]

# Start the app
CMD ["bun", "run", "start"]
