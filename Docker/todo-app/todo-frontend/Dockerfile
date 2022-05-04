FROM node:16 AS build-stage
WORKDIR /usr/src/app

FROM build-stage AS testing
COPY package*.json ./
RUN npm ci
COPY . .
RUN CI=true npm run test

FROM testing AS production
COPY . .
ENV REACT_APP_BACKEND_URL=http://localhost:4000
RUN npm run build

FROM nginx:1.20-alpine
COPY --from=production /usr/src/app/build /usr/share/nginx/html
COPY --from=production /usr/src/app/nginx.conf /etc/nginx/conf.d/default.conf
CMD [ "nginx", "-g", "daemon off;" ]