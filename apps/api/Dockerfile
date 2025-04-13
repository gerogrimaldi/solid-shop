# alpine es una imagen liviana
FROM node:20-alpine AS base
WORKDIR /app

# necesario en Alpine para Prisma y dependencias nativas
RUN apk update && apk add --no-cache libc6-compat

# instalar turbo y podar dependencias innecesarias
FROM base AS turbo-prune
RUN npm install -g turbo
COPY . . 
RUN turbo prune --scope=api --docker

# instalar dependencias
FROM base AS deps
WORKDIR /app
COPY --from=turbo-prune /app/out/json/ ./
RUN npm install

# build stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app ./
COPY --from=turbo-prune /app/out/full/ ./

# 👇 Copiar .env al builder antes de usar prisma
COPY .env .env

# prisma y build
RUN npx prisma generate
RUN npm run build --workspace=api

# producción
FROM node:20-alpine AS runner
WORKDIR /app

# crear usuario no-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# copiar lo necesario
COPY --from=builder /app/apps/api/dist/ ./dist
COPY --from=builder /app/node_modules/ ./node_modules
COPY --from=builder /app/apps/api/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# 👇 Copiar también el .env al runner
COPY --from=builder /app/.env .env

EXPOSE 8000
CMD ["node", "dist/main"]
