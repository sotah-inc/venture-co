#! /bin/sh

export $(cat ~/bin/battlenet-creds.env | xargs) && docker-compose run sotah-server-api