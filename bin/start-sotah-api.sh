#! /bin/sh

export $(cat ~/bin/battlenet-creds.env | xargs) \
  && docker-compose run --service-ports sotah-api