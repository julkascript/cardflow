# Use an official Node runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

COPY ./sample.env .env

# Copy package.json and package-lock.json to the working directory
COPY ./package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application
COPY ./ .

# Expose the port that your app will run on
EXPOSE 5173

# Define the command to run your app
CMD ["npm", "run", "dev"]