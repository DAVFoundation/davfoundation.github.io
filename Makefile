FORCE:

build: FORCE
	node-sass ./css/style.scss ./css/style.css

run: FORCE
	docker run -t --rm -v "$$PWD":/usr/src/app -p "4000:4000" starefossen/github-pages