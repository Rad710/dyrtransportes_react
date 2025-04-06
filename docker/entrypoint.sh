set -e

NGINX_DIR="/usr/share/nginx/html"

sed -i "s|/VITE_API_URL_PLACEHOLDER/|$VITE_API_URL|g" $NGINX_DIR/index.html
sed -i "s|VITE_API_URL_PLACEHOLDER|$VITE_API_URL|g" $NGINX_DIR/assets/*.js

# start server
exec nginx -g "daemon off;"