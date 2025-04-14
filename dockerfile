FROM node:22-alpine
WORKDIR /notejam
COPY package.json yarn.lock ./
RUN yarn install --production
COPY . .
CMD [ "node", "./bin/www" ]
EXPOSE 3000