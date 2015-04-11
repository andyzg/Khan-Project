set -e

$(npm bin)/watchify -v 1 src/js/main.js -o static/bundle.js &
compass watch . --sass-dir=src/sass/ --css-dir=static
