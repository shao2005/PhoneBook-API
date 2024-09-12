FROM node:latest

USER node

COPY --chown=node ./ /home/node/app