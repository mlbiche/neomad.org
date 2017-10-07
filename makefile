goto_src=cd ~/$(env)
git_update=git fetch origin $(env) && git checkout $(env) && git reset --hard FETCH_HEAD

help:
	@echo "Make tasks for deployment. Checkout the makefile content."

server_update:
	@make title text="Fetching prod branch and updating sources."
	ssh neomad "${goto_src} && ${git_update}"
	ssh neomad "${goto_src} && npm install"

server_reload:
	@make title text="Recreating the server."
	ssh neomad "${goto_src} && docker-compose restart web"

assets_build:
	ssh neomad "${goto_src} && npm run build"

deploy: server_update assets_build server_reload

install:
	bash -c "bin/install.sh"

start:
	bash -c "bin/start.sh"

title:
	@echo "\n\033[92m>>> $(text)\033[0m"

install_files:
	@make title text="Creating uploads dir"
	mkdir -p static/uploads/avatars
	chmod -R 777 static/uploads

	@make title text="Creating your config file"
	test -e settings.py || cp settings.example.py settings.py

fixtures:
	@make title text="Inserting fixtures data"
	bash -c "source ./venv/bin/activate && python3 bin/fixtures.py"
