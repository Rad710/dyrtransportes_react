FROM nginx:1.25

COPY dist /usr/share/nginx/html

COPY docker/entrypoint.sh /entrypoint.sh

USER root
CMD ["/entrypoint.sh"]