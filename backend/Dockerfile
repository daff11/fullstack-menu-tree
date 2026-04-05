FROM node:20.19.0

WORKDIR /app

# Copy package files & install deps
COPY package*.json ./
RUN npm install --production

# Install Nest CLI untuk build
RUN npm install -g @nestjs/cli

# Copy source code
COPY . .

# Build backend (Nest)
RUN npm run build

# Generate Prisma Client
RUN npx prisma generate --schema=./src/prisma/schema.prisma

EXPOSE 3000

# push schema sebelum start app
CMD npx prisma db push --schema=./src/prisma/schema.prisma && node dist/main.js