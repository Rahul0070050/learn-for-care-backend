FROM node:18

WORKDIR /usr/src/app

COPY . ./

RUN npm install

EXPOSE 3002

CMD [ "node", "index.js" ]