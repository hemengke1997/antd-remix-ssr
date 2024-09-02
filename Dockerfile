ARG NODE_VERSION=20.11.0
FROM node:${NODE_VERSION}-slim as base

RUN apt-get update && apt-get install -y git

# OR
# RUN apk add git

WORKDIR /app

COPY --link .npmrc pnpm-lock.yaml package.json ./
COPY patches ./patches

RUN npm i -g pnpm@9.7.1 && pnpm i --frozen-lockfile
RUN npm i pm2@5.4.2 --global

FROM base as builder

ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}

COPY --link . .

ENV IN_DOCKER=true

RUN \
	if [ "${NODE_ENV}" = "test" ]; then npm run build:test;\
	else npm run build; \
	fi

RUN pnpm prune --prod --config.ignore-scripts=true

FROM base as runner

COPY --from=builder /app /app

EXPOSE 3000

CMD [ "pm2-runtime", "start", "ecosystem.config.cjs" ]
