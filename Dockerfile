ARG NODE_VERSION=20.11.0
FROM node:${NODE_VERSION}-slim as base

RUN apt-get update && apt-get install -y git

WORKDIR /app

COPY --link .npmrc pnpm-lock.yaml package.json ./

RUN npm i -g pnpm && pnpm i --frozen-lockfile

FROM base as builder

ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}

COPY --link . .

ENV IN_DOCKER=true

RUN \
	if [ "${NODE_ENV}" == "test" ]; then npm run build:test;\
	else npm run build; \
	fi

FROM base as runnder

COPY --from=builder /app /app

EXPOSE 3000

CMD [ "npm", "run", "start" ]
