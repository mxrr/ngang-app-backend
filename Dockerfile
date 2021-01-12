FROM node:alpine

WORKDIR /usr/src/ngang-cc

COPY package*.json ./

RUN npm install

COPY . .

RUN cd ./ngang-app/ && npm install && npm run build && rm -r ../dist/* && cp -r ./dist/* ../dist/

CMD [ "node", "server.js" ]

