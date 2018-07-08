FORCE:

build: FORCE
	node-sass ./css/style.scss ./css/style.css --source-map true --output-style compressed
	uglifyjs ./js/main.js -c -m -o js/main.min.js
	
run: FORCE
	docker run -it --rm -v "$$PWD":/usr/src/app -p "80:4000" starefossen/github-pages