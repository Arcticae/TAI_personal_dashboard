FROM mhart/alpine-node:8.11.4

WORKDIR /node-app

COPY package*.json /node-app/

RUN npm install -g npm@5.6.0

COPY . /node-app/

EXPOSE 6969

CMD ["npm", "start"]