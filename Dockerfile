FROM node:24.11.1-alpine AS base

FROM base AS deps
WORKDIR /app
ADD package.json package-lock.json ./
RUN npm ci

FROM base AS production-deps
WORKDIR /app
ADD package.json package-lock.json ./
RUN npm ci -omit=dev

FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules /app/node_modules
ADD . .
RUN node ace build

FROM base AS production
ENV NODE_ENV=production
WORKDIR /app
COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app
CMD ["node", "./bin/server.js"]
