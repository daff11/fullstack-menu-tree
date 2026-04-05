FROM node:20.19.0

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build frontend
RUN npm run build

# Install serve
RUN npm install -g serve

EXPOSE 5173

# Serve build
CMD ["serve", "-s", "dist", "-l", "5173"]
