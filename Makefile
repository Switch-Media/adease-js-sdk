CWD=${PWD}

test:
	docker run --rm adease-js-sdk/test 

docker-image:
	docker build -t adease-js-sdk/test -f Dockerfile .

unit: docker-image test

compile:
	docker run --rm --volume $(CWD):/code adease-js-sdk/test sh -c "npm install && ./node_modules/.bin/webpack"

archive: compile
	zip -r build/$(ARCHIVE_NAME).zip src tests dist package.json README.md

.PHONY: build
