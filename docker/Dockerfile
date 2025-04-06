## docker build -t dyrtransportes-nginx:1.10.0 -f docker/Dockerfile .
## or ${REGISTRY}/dyrtransportes/dyrtransportes-react:1.10.0

FROM nginx:1.27.4-bookworm-perl

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

COPY dist /usr/share/nginx/html
