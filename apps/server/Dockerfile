FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Copy Prisma files
COPY prisma ./prisma
RUN npx prisma generate

# Copy source code
COPY tsconfig.json ./
COPY src ./src

# Build TypeScript
RUN npx tsc

# Expose port
EXPOSE 3000

# Run compiled JavaScript
CMD ["node", "dist/index.js"]
