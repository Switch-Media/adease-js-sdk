FROM node:9.4-alpine

RUN mkdir /code

COPY package.json /code/
COPY package-lock.json /code/

WORKDIR /code

RUN npm install

CMD ["npm", "test"]
