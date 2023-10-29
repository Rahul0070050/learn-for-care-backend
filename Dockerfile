FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

EXPOSE 3002

CMD [ "node", "/src/index.js" ]