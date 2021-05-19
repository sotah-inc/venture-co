#! /bin/sh

export $(cat ~/bin/battlenet-creds.env | xargs) \
  && docker-compose up -d sotah-api-public \
  && docker-compose up -d sotah-api-private \
  && docker-compose logs -f sotah-api-public sotah-api-private