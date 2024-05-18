FROM node:21-alpine3.18

WORKDIR /usr/src/cache

COPY package.json .
COPY sample.env .env

COPY ./frontend-entrypoint.sh .

COPY . .

RUN npm install

RUN sed -i 's/\r$//g' /usr/src/app/frontend-entrypoint.sh
RUN chmod +x /usr/src/app/frontend-entrypoint.sh


EXPOSE 5173

CMD ["npm", "run", "dev", "--host", "0.0.0.0"]
