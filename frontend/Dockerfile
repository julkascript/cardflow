FROM node:21-alpine3.18

WORKDIR /usr/src/cache

COPY package.json .
COPY sample.env .env

RUN npm install

WORKDIR /usr/src/app

COPY . .

EXPOSE 5173
