FROM nginx:alpine

COPY ./*.html /usr/share/nginx/html/
COPY ./clients.html /usr/share/nginx/html/clients/index.html
COPY ./admin.html /usr/share/nginx/html/admin/index.html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]