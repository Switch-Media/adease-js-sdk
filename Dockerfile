FROM node:10.15-alpine

RUN mkdir /code

COPY . /code/

WORKDIR /code

ENV NODE_ENV=development
RUN npm install

CMD ["npm", "test"]
