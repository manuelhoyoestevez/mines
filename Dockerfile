FROM node:10.15.3-stretch

# Prepare app directory
RUN mkdir -p /usr/src/app
ADD . /usr/src/app
WORKDIR /usr/src/app

# Delete old instalation files
RUN rm -rf ./node_modules

# Install node_modules
RUN npm install

# Build the app
CMD bash -c "npm install && npm start"
