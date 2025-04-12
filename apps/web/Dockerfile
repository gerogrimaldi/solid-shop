FROM node:20 AS builder

WORKDIR /app

# Copy root package.json and lockfile
COPY package.json package-lock.json ./

# Copy the api package.json
COPY apps/web/package.json ./apps/web/package.json

RUN npm install

# Copy app source
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]