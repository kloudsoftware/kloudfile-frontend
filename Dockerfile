FROM voidlinux/voidlinux
RUN xbps-install -Syu nodejs nginx curl
WORKDIR /app
ADD src/ src/
ADD package.json .
ADD static/ static/
RUN npm install && npm run build &&  mv /app/dist/* /usr/share/nginx/html
RUN curl https://gist.githubusercontent.com/larsgrah/6003204aaf2b32b885682e7fe94c0ed8/raw/62b96d8820b62220d618fb4edb00223862c66127/nginx.conf -o /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]