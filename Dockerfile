FROM node:13-alpine

WORKDIR /app

COPY package-lock.json .
COPY package.json .
RUN npm install
COPY src/ ./src/
COPY img/ ./img/
COPY .babelrc index.html routes.js run.js webpack.prod.config.js ./

RUN npm run build

