FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN node_modules/.bin/prisma generate
RUN node_modules/.bin/tsc

EXPOSE 5000

CMD ["npm", "run", "start"]