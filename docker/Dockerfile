FROM nginx:latest

COPY dist /usr/share/nginx/html

USER nginx
CMD ["nginx", "-g", "daemon off;"]