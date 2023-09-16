FROM node:18

WORKDIR /usr/src/app

COPY build ./

EXPOSE 8080

CMD [ "node", "build/index.js" ]