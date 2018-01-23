test:
	docker run --rm adease-js-sdk/test 

build:
	docker build -t adease-js-sdk/test -f Dockerfile .

unit: build test

archive:
	zip -r build/$(ARCHIVE_NAME).zip src tests composer.json composer.lock phpunit.xml README.md

.PHONY: build
