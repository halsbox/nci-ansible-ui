FROM node:18-alpine as base
ENV NODE_ENV="production"
ENV USER="nci-ansible-ui-installer"
ENV USER_ID=2000
ENV USER_GORUP_ID=2000

RUN addgroup -g "$USER_GORUP_ID" "$USER" && \
  adduser -D -G "$USER" -u "$USER_ID" "$USER" && \
  apk add --no-cache git && \
  mkdir -p /var/nci-ansible-ui && \
  chown -R "$USER":"$USER" /var/nci-ansible-ui
WORKDIR /var/nci-ansible-ui
USER ${USER}

FROM base as builder
ENV REPO=https://github.com/halsbox/nci-ansible-ui.git
ENV BRANCH=feature/mandatory-vars
RUN git clone ${REPO} . && \
  git checkout ${BRANCH} && \
  npm i --only=prod && \
  cp -R node_modules ../prod_node_modules && \
  npm --production=false install && \
  npm run build

FROM base as release
COPY --from=builder /var/nci-ansible-ui/prod_node_modules ./node_modules
COPY --from=builder /var/nci-ansible-ui/static ./static
ADD data /var/nci-ansible-ui/data
ADD entrypoint.sh /entrypoint.sh
USER root
RUN apk add --no-cache openssh rsync ansible
ENTRYPOINT ["/entrypoint.sh"]
