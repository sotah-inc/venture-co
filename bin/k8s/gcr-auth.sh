#! /bin/sh

AUTH_KEY_FILEPATH=$1
EMAIL=$2

kubectl create secret docker-registry gcr-json-key \
  --docker-server=gcr.io \
  --docker-username=_json_key \
  --docker-password="$(cat "$AUTH_KEY_FILEPATH")" \
  --docker-email="$EMAIL"

kubectl patch serviceaccount default \
  -p '{"imagePullSecrets": [{"name": "gcr-json-key"}]}'
