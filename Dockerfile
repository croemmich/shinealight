FROM myriadmobile/nginx-hhvm-laravel5:v1.20
MAINTAINER Chris Roemmich <info@shinealight.us>

ADD . /var/www/

RUN composer install --no-dev