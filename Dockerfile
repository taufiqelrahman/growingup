FROM node:12.16-alpine

# Create app directory
WORKDIR /usr/src/gu

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json *yarn* ./

# Install yarn from the local .tgz
# RUN npm install
RUN yarn

# Bundle app source
COPY . ./

# Building app
# RUN npm run build

# Running the app production
# CMD [ "npm", "run", "start" ]
# Running the app development
# CMD [ "npm", "run", "dev" ]
ENTRYPOINT ["yarn", "run", "deploy"]
# ENTRYPOINT ["npm", "run", "start"]