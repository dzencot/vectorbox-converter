install:
	npm install

lint:
	npm run eslint ./

test:
	npm test

test-debug:
	DEBUG="converter:*" npm test

test-watch:
	npm run test-watch

build:
	rm -rf dist
	npm run build

publish:
	npm publish

.PHONY: test
