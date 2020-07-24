FROM node:12

WORKDIR /usr/src/app
COPY .env ./
COPY package*.json ./
COPY yarn.lock ./
COPY tsconfig.json ./
COPY webpack.config.js ./
COPY .babelrc ./

RUN yarn

COPY src/ src/

RUN yarn build