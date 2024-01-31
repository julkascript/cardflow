FROM node:14-alpine

WORKDIR /usr/src/app

COPY package.json .
COPY sample.env .env
COPY . .

RUN npm install

EXPOSE 5173
CMD ["npm", "run", "build"]
#CMD ["npm", "run", "dev", "--host", "0.0.0.0"]