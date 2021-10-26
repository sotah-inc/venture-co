#! /bin/sh

export $(cat ~/bin/battlenet-creds.env | xargs) \
  && kubectl \
    create secret generic battlenet-creds \
    --from-literal=client-id="$CLIENT_ID" \
    --from-literal=client-secret="$CLIENT_SECRET" \
    --dry-run=client \
    -o yaml | \
    kubectl apply -f -
