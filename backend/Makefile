build:
	npx tsc
server: build
	node server.js
clean:
	find . -name "*.js" -type f -not -path "./node_modules/*" -delete
