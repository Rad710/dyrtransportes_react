#!/bin/bash
set -e

NGINX_DIR="/usr/share/nginx/html"

#replace placeholder with actual values
sed -i "s|/VITE_API_URL_PLACEHOLDER/|$VITE_API_URL|g" $NGINX_DIR/index.html
sed -i "s|/VITE_API_URL_PLACEHOLDER/|$VITE_API_URL|g" $NGINX_DIR/assets/index*.css
sed -i "s|VITE_API_URL_PLACEHOLDER|$VITE_API_URL|g" $NGINX_DIR/assets/index*.js

# start server
exec nginx -g "daemon off;"