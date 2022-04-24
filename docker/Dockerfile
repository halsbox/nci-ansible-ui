FROM node:18-alpine as builder
ENV NODE_ENV="production"
USER="node"
ADD package.json package-lock.json
ADD data /app/data
RUN apk add --no-cache git openssh rsync ansible
  chown -R node:node /app
WORKDIR /app
RUN npm ci --only=prod && \
  ansible --version >> dependencies-info.txt && \
  echo "nodejs: `node --version`" >> dependencies-info.txt && \
  npmPackages=`npm ls --prod --depth=0 | tail -n +2` && \
  echo -e "npm packages:\n$npmPackages" >> dependencies-info.txt
USER root
ADD entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
