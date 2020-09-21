FROM nginx

# Copy our nginx configuration file, i.e. "nginx.conf" from our
# FileSystem to that of the Container
# Note that there is a "default.conf" file that is include with nginx, by default.
# So, by putting on "default.conf" on the right-hand side, we are saying very clearly: 
# "yes take my file and overwrite the existing one, just overwrite what ever is there".
COPY ./default.conf /etc/nginx/conf.d/default.conf

