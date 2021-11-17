#! /bin/sh

./bin/rebuild-ui.sh \
  && kubectl rollout restart deployment sotah-ui-deployment
