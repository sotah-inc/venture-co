#! /bin/sh

export $(cat ~/bin/battlenet-creds.env | xargs) \
  && docker compose stop sotah-server-api \
  && docker compose rm -fv sotah-server-api \
  && docker compose up -d sotah-server-api \
  && docker compose logs -f sotah-server-api
