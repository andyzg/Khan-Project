set -e

watchify -v 1 src/js/main.js -o static/bundle.js &
sass --watch src/sass/style.scss:static/style.css
