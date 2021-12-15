#! /bin/sh

./bin/rebuild-api.sh \
  && kubectl rollout restart statefulset sotah-api-statefulset
