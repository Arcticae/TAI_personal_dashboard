FROM mhart/alpine-node:8.11.4

WORKDIR /react-app

COPY package*.json /react-app/

RUN npm install -g npm@5.6.0

COPY . /react-app/

EXPOSE 3000

CMD [ "npm", "start" ]