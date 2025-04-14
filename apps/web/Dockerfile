# Stage 1: Prune con Turbo
FROM node:20-alpine AS base

ARG NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}
RUN echo "##################### NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}"
ARG BUCKET_URL 
ENV BUCKET_URL=${BUCKET_URL}
RUN echo "##################### BUCKET_URL=${BUCKET_URL}"

FROM base as builder
RUN apk update
RUN apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune web --docker --out-dir out-web

# Stage 2: installer
FROM base AS installer
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app

# First install the dependencies (as they change less often)
COPY --from=builder /app/out-web/json/ .
RUN npm install

# Build the project
COPY --from=builder /app/out-web/full/ .
WORKDIR /app/apps/web
RUN npm run build

# Stage 3: Runtime
FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./ 
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/public/_next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

EXPOSE 3000
CMD  ["node", "apps/web/server.js"]