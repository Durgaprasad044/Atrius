FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Generate Prisma client first, then compile TypeScript
RUN node_modules/.bin/prisma generate
RUN node_modules/.bin/tsc

EXPOSE 5000

CMD ["node", "dist/index.js"]