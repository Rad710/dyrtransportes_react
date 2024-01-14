FROM nginx:latest

COPY dist /usr/share/nginx/html

COPY docker/entrypoint.sh /entrypoint.sh

CMD ["/entrypoint.sh"]