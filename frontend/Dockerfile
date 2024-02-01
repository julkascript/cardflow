FROM node:14-alpine

WORKDIR /usr/src/app

COPY package.json .
COPY sample.env .env

COPY ./frontend-entrypoint.sh .

COPY . .

RUN npm install

RUN sed -i 's/\r$//g' /usr/src/app/frontend-entrypoint.sh
RUN chmod +x /usr/src/app/frontend-entrypoint.sh


EXPOSE 5173

CMD ["npm", "run", "dev", "--host", "0.0.0.0"]