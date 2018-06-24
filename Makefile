FORCE:

build: FORCE
	node-sass ./css/style.scss ./css/style.css --source-map true
	node-sass ./css/token-sale.scss ./css/token-sale.css --source-map true
	
run: FORCE
	docker run -it --rm -v "$$PWD":/usr/src/app -p "80:4000" starefossen/github-pages