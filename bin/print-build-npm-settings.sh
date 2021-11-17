#! /bin/sh

gcloud artifacts print-settings npm \
  --scope=@sotah-inc \
  --repository=sotah-inc \
  --location=us-central1 \
  --project=sotah-prod \
  --json-key=./etc/build-gcp-key.json
