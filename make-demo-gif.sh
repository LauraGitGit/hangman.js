#!/usr/bin/env bash
# Creates images/demo.gif from the hangman stage images.
# Requires ImageMagick: https://imagemagick.org/ (e.g. brew install imagemagick)

set -e
cd "$(dirname "$0")"
IMGDIR="images"

if ! command -v convert &>/dev/null && ! command -v magick &>/dev/null; then
  echo "ImageMagick not found. Install it first, e.g.: brew install imagemagick"
  exit 1
fi

# Frame delay in centiseconds (100 = 1 second)
DELAY=100
# Order: stages 0–6, then win
FILES=(
  "$IMGDIR/hangman-0.png"
  "$IMGDIR/hangman-1.png"
  "$IMGDIR/hangman-2.png"
  "$IMGDIR/hangman-3.png"
  "$IMGDIR/hangman-4.png"
  "$IMGDIR/hangman-5.png"
  "$IMGDIR/hangman-6.png"
  "$IMGDIR/Hangman-win.png"
)

for f in "${FILES[@]}"; do
  if [[ ! -f "$f" ]]; then
    echo "Missing: $f"
    exit 1
  fi
done

if command -v magick &>/dev/null; then
  magick -delay "$DELAY" -loop 0 "${FILES[@]}" "$IMGDIR/demo.gif"
else
  convert -delay "$DELAY" -loop 0 "${FILES[@]}" "$IMGDIR/demo.gif"
fi

echo "Created: $IMGDIR/demo.gif"
