FROM node:16

WORKDIR /usr/src/app

COPY ./src/package.json /usr/src/app

RUN npm install

COPY ./src /usr/src/app

EXPOSE 5050
#ENTRYPOINT [ "http-server", "client.html" ]
CMD [ "node", "websocket_server.js" ]