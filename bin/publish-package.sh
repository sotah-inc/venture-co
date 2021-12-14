#! /bin/sh

COMMIT_MESSAGE=$1

run-s build:ts ar-login \
  && npm version patch \
  && npm publish \
  && git add . \
  && git commit -m "$COMMIT_MESSAGE" \
  && git push origin master
