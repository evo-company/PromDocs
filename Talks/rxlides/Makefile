browserify = $(shell npm bin)/browserify
node_static = $(shell npm bin)/static
uglifyjs = $(shell npm bin)/uglifyjs

.PHONY: dist
dist:
	make dist/main.js
	make dist/common.css

dist/main.js: src/*.js src/**/*.js Makefile
	mkdir -p $(@D)
	$(browserify) src/main.js -t babelify | $(uglifyjs) --mangle > $@

dist/common.css: src/*.css Makefile
	mkdir -p $(@D)
	cp src/common.css $@

.PHONY: serve
serve:
	@echo serving at http://localhost:8000
	@$(node_static) . -p 8000 -z > /dev/null
