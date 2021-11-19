#! /bin/sh

kubectl apply \
  -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.3.1/aio/deploy/recommended.yaml

kubectl patch deployment kubernetes-dashboard \
  -n kubernetes-dashboard \
  --type json \
  -p '[{ "op": "add", "path": "/spec/template/spec/containers/0/args/2", "value": "--token-ttl=0" }]'
