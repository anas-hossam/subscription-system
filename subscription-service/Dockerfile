FROM node:12.9.0 AS deps
ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
WORKDIR /var/code
COPY package.json .
RUN npm install
ADD . /var/code

FROM ubuntu:16.04 AS base
ENV ENVCONSUL_VERSION 0.7.3
WORKDIR /var/code
RUN apt-get update && apt-get install -y libcurl3-gnutls curl
RUN curl -so envconsul.tgz \
    "https://releases.hashicorp.com/envconsul/${ENVCONSUL_VERSION}/envconsul_${ENVCONSUL_VERSION}_linux_amd64.tgz"
RUN tar -xvzf envconsul.tgz
RUN chmod +x envconsul

FROM node:12.9.0
WORKDIR /var/code
RUN apt-get update && apt-get install -y vim
COPY --from=deps /var/code /var/code
COPY --from=base /var/code/envconsul /bin/envconsul
RUN chmod +x src/index.js
ENTRYPOINT ["./src/index.js"]
