FROM node:18

COPY build ./

EXPOSE 8080

CMD [ "node", "./server.js" ]