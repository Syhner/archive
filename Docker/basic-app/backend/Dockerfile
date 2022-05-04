FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY --chown=node:node . .

USER node

ENV PORT=4000

EXPOSE 4000

CMD npm start