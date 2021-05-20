#! /bin/sh

cd extern/venture-co-api/app \
  && npm install \
  && ~/bin/install-sotah-dep.sh core \
  && ~/bin/install-sotah-dep.sh server \
  && ~/bin/install-sotah-dep.sh api \
  && run-s build \
  && rm -rf node_modules build \
  && cd .. \
  && git status . \
  && gcloud builds submit --config ./cloudbuild-gcr.yaml \
  && docker pull gcr.io/sotah-prod/api \
  && git add . \
  && git commit -m 'Update to latest.' \
  && git push origin HEAD
