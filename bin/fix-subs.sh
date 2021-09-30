#! /bin/sh

SRC=$1
DST=$2

echo $SRC

RESULTS=`find "$SRC" -type f`

for SRC_FILEPATH in "$1"/*
do
  echo "SRC_FILEPATH: $SRC_FILEPATH"

  DST_FILENAME=`basename "$SRC_FILEPATH"`

  DST_FILEPATH="$DST/$DST_FILENAME"

  echo "DST_FILEPATH: $DST_FILEPATH"

  ffmpeg \
    -i "$SRC_FILEPATH" \
    -y -c copy -map 0:v:0 -map 0:a:1 -map 0:a:0 -map 0:s:0 -scodec mov_text \
    "$DST_FILEPATH"
done
