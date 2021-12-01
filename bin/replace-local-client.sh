#! /bin/sh

FILEPATH=$(npm pack ../../../packages/client | tail -1)
npm install "$FILEPATH"
rm "$FILEPATH"
