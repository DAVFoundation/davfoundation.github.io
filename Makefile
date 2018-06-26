FORCE:

build: FORCE
	node-sass ./css/style.scss ./css/style.css --source-map true --output-style compressed
	node-sass ./css/token-sale.scss ./css/token-sale.css --source-map true --output-style compressed
	uglifyjs ./js/main.js -c -m -o js/main.min.js
	uglifyjs ./js/token-sale.js -c -m -o js/token-sale.min.js
	
run: FORCE
	docker run -it --rm -v "$$PWD":/usr/src/app -p "80:4000" starefossen/github-pages