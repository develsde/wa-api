FROM --platform=linux/amd64 node:slim AS app
#FROM --platform=linux/amd64 node:18-alpine
# Create app directory
WORKDIR /app

#ARG NODE_VERSION=18.16.0
#ARG ALPINE_VERSION=3.17.2

#FROM node:${NODE_VERSION}-alpine AS node

#FROM alpine:${ALPINE_VERSION}

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD false

# Install Google Chrome Stable and fonts
# Note: this installs the necessary libs to make the browser work with Puppeteer.
RUN apt-get update && apt-get install curl gnupg -y \
  && curl --location --silent https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install google-chrome-stable -y --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

RUN apt-get update && apt-get install -y \
    software-properties-common \
    npm
RUN npm install npm@latest -g && \
    npm install n -g && \
    n latest

#RUN mkdir -p /usr/src/app/node_modules && chown -R node:node /usr/src/app

#WORKDIR /usr/src/app
RUN npm install nodemon -g
#WORKDIR /app
#COPY --chown=app:node package*.json .
#RUN npm install
#COPY --chown=app:node . .

#RUN apk update

RUN apt-get install git
#RUN apk add zip

RUN git clone https://github.com/develsde/wa-api.git .

#COPY package*.json ./

#USER node

#RUN npm r whatsapp-web.js

#RUN npm install yarn -g

RUN yarn

#COPY --chown=node:node . .

EXPOSE 3035

#RUN yarn dev 3030
#CMD ["npm", "run", "dev"]
CMD ["yarn", "dev", "3035"]
#CMD [ "nodemon", "./src/index.js", "--inspect=3035" ]