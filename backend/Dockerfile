FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Generate Prisma client first, then compile TypeScript
RUN node_modules/.bin/prisma generate
RUN node_modules/.bin/tsc

# Verify dist output exists
RUN ls -la dist/ && cat dist/index.js | head -5

EXPOSE 5000

CMD ["sh", "-c", "node_modules/.bin/prisma migrate deploy && node dist/index.js"]