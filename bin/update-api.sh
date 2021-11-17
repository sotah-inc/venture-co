#! /bin/sh

./bin/rebuild-api.sh \
  && kubectl rollout restart deployment sotah-api-deployment
