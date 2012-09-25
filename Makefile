NODE = node
TEST = ./node_modules/.bin/vows
TESTS ?= test/*-test.js

test:
	@NODE_ENV=test NODE_PATH=lib $(TEST) $(TEST_FLAGS) $(TESTS)

docs: docs/api.html

docs/api.html: lib/passport-singly/*.js
	dox \
		--title Passport-Singly \
		--desc "Singly authentication strategy for Passport" \
		$(shell find lib/passport-singly/* -type f) > $@

docclean:
	rm -f docs/*.{1,html}

.PHONY: test docs docclean
