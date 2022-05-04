FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY --chown=node:node . .

USER node

ENV PORT=4000

EXPOSE 4000

CMD ["npm", "run", "dev"]