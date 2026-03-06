FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN chmod +x node_modules/.bin/tsc && node_modules/.bin/tsc
RUN chmod +x node_modules/.bin/prisma
RUN chmod +x node_modules/.prisma/client/libquery_engine* 2>/dev/null || true

EXPOSE 5000

CMD ["sh", "-c", "node_modules/.bin/prisma migrate deploy && node dist/index.js"]