# 1st build phase:

#FROM node:alpine as builder
FROM node:alpine

WORKDIR "/app"

COPY ./package.json .

RUN npm install

COPY . .

# build the production version of our assets. 
# The result of this will be a "build" folder inside the "app" fodler (i.e. /app/build/)
# It is this "build" folder we want to copy to the nginx phase of our build. 
RUN npm run build


# 2nd build phase: 

FROM nginx

EXPOSE 3000

# we override the default nginx .conf file. 
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# we copy over all the production built asserts from the build phase (i.e. the prev. phase). 
#COPY --from=builder /app/build /usr/share/nginx/html
COPY --from=0 /app/build /usr/share/nginx/html



