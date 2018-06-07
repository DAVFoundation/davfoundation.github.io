FORCE:

build: FORCE
	node-sass ./css/style.scss ./css/style.css
	node-sass ./css/token-sale.scss ./css/token-sale.css
	
run: FORCE
	docker run -it --rm -v "$$PWD":/usr/src/app -p "4000:4000" starefossen/github-pages