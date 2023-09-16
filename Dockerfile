FROM node:18

COPY package*.json ./

RUN npm install

COPY build .

EXPOSE 8080

CMD [ "node", "server.js" ]