FROM node:21-alpine3.18

WORKDIR /usr/src/cache

COPY package.json .
COPY sample.env .env

COPY . .

RUN npm install

EXPOSE 5173

CMD ["npm", "run", "dev", "--host", "0.0.0.0"]
