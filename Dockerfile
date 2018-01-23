FROM node:9.4-alpine

RUN mkdir /code

COPY . /code/

WORKDIR /code

ENV NODE_ENV=development
RUN npm install

CMD ["npm", "test"]
