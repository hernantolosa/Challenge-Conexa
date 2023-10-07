FROM node:18-alpine3.17

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

EXPOSE 3000
CMD [ "npm", "run","start:prod" ]
