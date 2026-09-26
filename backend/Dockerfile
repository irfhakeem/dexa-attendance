# build
FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx prisma generate

RUN npm run build

# runtime
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=${NODE_ENV:-production}

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/dist ./dist

COPY --from=builder /app/prisma ./prisma

EXPOSE ${INTERNAL_PORT:-8000}

CMD ["node", "dist/main.js"]
