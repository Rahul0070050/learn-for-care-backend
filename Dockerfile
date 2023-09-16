FROM node:18

WORKDIR /usr/src/app

COPY build ./usr/src/app

EXPOSE 8080

CMD [ "node", "./server.js" ]