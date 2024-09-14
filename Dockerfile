FROM node:latest

COPY package*.json ./
RUN npm install

USER node

COPY --chown=node ./ /home/node/app