# building
FROM node:10-alpine

# copying in source
COPY ./app /srv/app
WORKDIR /srv/app

# adding deps
RUN apk --no-cache add --virtual native-deps \
  git g++ gcc libgcc libstdc++ linux-headers make python

# installing deps and building
RUN npm install -s -g node-gyp \
  && npm install -s \
  && npm rebuild bcrypt --build-from-source \
  && npm run -s build:clean

# removing dev/build deps and installing only prod deps
RUN rm -rf ./node_modules \
  && npm install --only=production \
  && npm rebuild bcrypt --build-from-source

# slimming down the build
RUN npm cache clean --force \
  && apk del native-deps
