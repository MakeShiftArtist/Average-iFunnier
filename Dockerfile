# Use the official Node.js v19.x image
FROM node:18

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

ENV NODE_ENV=prod

# Copy the rest of the application code to the container
COPY . .

# Start the application with ts-node
CMD ["npx", "ts-node", "src/index.ts"]
