FROM node:12.16-alpine

# Create app directory
WORKDIR /usr/src/gu

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Install yarn from the local .tgz
# RUN npm install
# RUN yarn
RUN apk --no-cache --virtual build-dependencies add \
    python \
    make \
    g++ \
    && npm -g install pm2 \
    && npm install \
    && apk del build-dependencies

# Bundle app source
COPY . ./

# Building app
# RUN npm run build

# Running the app production
# CMD [ "npm", "run", "start" ]
# Running the app development
# CMD [ "npm", "run", "dev" ]
ENTRYPOINT ["npm", "run", "deploy"]
# ENTRYPOINT ["npm", "run", "start"]