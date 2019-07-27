FROM mhart/alpine-node:8.11.4

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . .

COPY package*.json ./

RUN npm install -g npm && npm install && npm ls

EXPOSE 6969

CMD ["npm", "start"]