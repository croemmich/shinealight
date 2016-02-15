NAME = shinealight
REPO = croemmich
BASE = myriadmobile/nginx-hhvm-laravel5:v1.20
VERSION = v1.0.0

build: update-base build-image

push: push-image

release: build push

clean:
		@docker rmi $$(docker images | grep "^${REPO}/${NAME} " | awk '{print $$3}') 2>/dev/null || true
		@echo clean: done

update-base:
		docker pull $(BASE)

build-image:
		docker build --rm --pull -t $(REPO)/$(NAME) .
		docker tag $(REPO)/$(NAME) $(REPO)/$(NAME):$(VERSION)

push-image:
		docker push $(REPO)/$(NAME):$(VERSION)
		docker push $(REPO)/$(NAME):latest