FROM alpine:latest

RUN apk update && apk add nodejs npm mysql-client curl

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080
CMD [ "node", "server.js" ]
