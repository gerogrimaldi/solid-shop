# alpine es una imagen liviana
FROM node:20-alpine AS base
WORKDIR /app

# necesario en Alpine para Prisma y dependencias nativas
RUN apk update && apk add --no-cache libc6-compat

#  instalar turbo yborrar dependencias innecesarias
FROM base AS turbo-prune
RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=api --docker

# instalo dependencias
FROM base AS deps
WORKDIR /app
COPY --from=turbo-prune /app/out/json/ ./
RUN npm install

# build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app ./
COPY --from=turbo-prune /app/out/full/ ./

# prisma y nest
RUN npx prisma generate
RUN npm run build --workspace=api

# final solo lo necesario para producción
FROM node:20-alpine AS runner
WORKDIR /app

# crear usuario no-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# copiar solo dist y modulos necesarios
COPY --from=builder /app/apps/api/dist/ ./dist
COPY --from=builder /app/node_modules/ ./node_modules
COPY --from=builder /app/apps/api/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

EXPOSE 8000
CMD ["node", "dist/main"]
