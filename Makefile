local:
	mkdir -p static
	./local.sh

test:
	jshint src/js/*
	$(npm bin)/mochify

install:
	npm install
	bundle install
