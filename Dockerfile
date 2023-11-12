FROM nginx:latest

COPY dist /usr/share/nginx/html

EXPOSE 80

RUN ls

CMD ["nginx", "-g", "daemon off;"]
