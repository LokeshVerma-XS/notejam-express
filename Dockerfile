FROM node:16
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install 
COPY . .
CMD [ "sh", "-c", "node db.js && node ./bin/www" ]
EXPOSE 3000
