FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install yarn package manager
RUN npm install yarn

# Install project dependencies
RUN yarn install --frozen-lockfile

# Copy the entire project to the container
COPY . .

# Expose the port your application listens on
EXPOSE 3000

# Start the application
CMD ["yarn", "start"]
