FROM node:18-alpine as builder
ENV NODE_ENV="production"
ADD package.json package-lock.json data /app/
RUN apk add --no-cache git openssh rsync ansible && \
  chown -R node:node /app
WORKDIR /app
USER node
RUN npm ci --only=prod
USER root
ADD entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
