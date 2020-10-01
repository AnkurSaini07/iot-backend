FROM node:alpine
RUN mkdir /home/iot-backend
WORKDIR /home/iot-backend
COPY dist/backend/src src
COPY package.json .
COPY .env .
RUN apk add --no-cache --virtual .gyp python make g++ && npm install --production  && apk del .gyp
EXPOSE 2000
CMD node src/Server.js
