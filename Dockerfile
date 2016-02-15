FROM myriadmobile/nginx-hhvm-laravel5:v1.20
MAINTAINER Chris Roemmich <info@shinealight.us>

# force https
RUN sed -i 's|.*charset.*|&\n    if ($http_x_forwarded_proto != "https") { rewrite ^ https://$host$uri permanent; }|' /etc/nginx/sites-enabled/default.conf

# let laravel handle the proxy
RUN rm /etc/nginx/conf.d/real-ips.conf

ADD . /var/www/
RUN composer install --no-dev