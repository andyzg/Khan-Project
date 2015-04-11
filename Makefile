local:
	./local.sh

build:
	mkdir -p static
	browserify src/js/main.js | uglifyjs -c > static/bundle.js
	compass compile . --sass-dir=src/sass/ --css-dir=static --output compressed

test:
	mochify
