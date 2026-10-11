# syntax=docker/dockerfile:1

FROM node:24-alpine AS build
RUN corepack enable && corepack prepare pnpm@10 --activate
WORKDIR /app

COPY src/package.json src/pnpm-lock.yaml ./
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

COPY src/ ./
RUN pnpm build

FROM joseluisq/static-web-server:2
COPY docker/sws.toml /etc/sws.toml
COPY --from=build /app/dist /public

ENV SERVER_CONFIG_FILE=/etc/sws.toml
EXPOSE 8080
