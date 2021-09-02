# using node alpine as base image
FROM node:alpine

# working dir ./app
WORKDIR /app

# Copy the package.json
COPY ["package.json", "package-lock.json*", "./"]

# Install the dependencies
RUN npm install

# Copy the server and ethereum module
COPY . .

EXPOSE 3000

# set the default command
CMD ["npm","run","app"]