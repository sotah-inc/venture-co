#! /bin/sh

cd extern/venture-co-next/app \
  && npm install \
  && ~/bin/install-sotah-dep.sh core \
  && ~/bin/install-sotah-dep.sh client \
  && run-s build \
  && rm -rf ./node_modules ./src/.next \
  && cd .. \
  && git status . \
  && gcloud builds submit --config ./cloudbuild-gcr.yaml \
  && git add . \
  && git commit -m 'Update to latest.' \
  && git push origin HEAD
