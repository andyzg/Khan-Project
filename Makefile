local:
	./local.sh

build:
	mkdir -p static
	browserify src/js/main.js | uglifyjs -c > static/bundle.js
	sass src/sass/style.scss:static/style.css --style compressed
