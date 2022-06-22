FROM node:alpine

WORKDIR /usr/app

COPY package.json ./

COPY yarn.lock ./

RUN yarn

COPY . . 

EXPOSE 3333

CMD ["yarn","build","&&","yarn","start"] 