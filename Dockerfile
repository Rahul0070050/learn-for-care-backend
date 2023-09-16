FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY ./build .

EXPOSE 8080

CMD [ "node", "index.js" ]