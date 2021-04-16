#! /bin/sh

export $(cat ~/bin/battlenet-creds.env | xargs) \
  && docker-compose up -d sotah-server-api \
  && docker-compose logs -f sotah-server-api