# Base Alpine image
FROM node:20-alpine AS base
RUN apk update && apk add --no-cache libc6-compat
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

# Debug stage - let's see what files we have
FROM base AS pruner
WORKDIR /app
RUN npm install -g turbo
COPY . .
# Run prune but also print directory structure
RUN turbo prune api --docker

################################################### Install dependencies stage
FROM base AS installer
WORKDIR /app
# Copy all pruned files first
COPY --from=pruner /app/out/full/ .
COPY --from=pruner /app/out/json/ .
# Install dependencies
RUN npm install
# Debug: Check for prisma directory
RUN find /app -name "prisma" -type d

############################### Build stage
FROM installer AS builder
WORKDIR /app
COPY --from=installer /app/node_modules/ ./node_modules
# Try to find and generate prisma
RUN find /app -name "schema.prisma" -type f
# Run generate from the correct location
RUN cd $(find /app -name "schema.prisma" -type f | xargs dirname) && \
    npx prisma generate
# Build the application
WORKDIR /app/apps/api
RUN npm run build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

COPY --from=builder /app/node_modules/ ./node_modules
# COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules

WORKDIR /app/apps/api
COPY --from=builder /app/apps/api/dist/ ./dist
COPY --from=builder /app/apps/api/node_modules ./node_modules
COPY --from=builder /app/apps/api/package.json ./package.json
# Find and copy the prisma directory
COPY --from=builder /app/apps/api/prisma ./prisma

EXPOSE 8000

CMD ["npm", "run", "start:prod"]