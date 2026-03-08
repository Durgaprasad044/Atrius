FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN node_modules/.bin/prisma generate
RUN node_modules/.bin/tsc

EXPOSE 5000

CMD ["node", "-e", "console.log('NODE STARTED'); console.log('PORT:', process.env.PORT); console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL); try { require('./dist/index.js'); } catch(e) { console.error('REQUIRE ERROR:', e); process.exit(1); }"]
