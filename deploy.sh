# 7. Build all our images, tag each one, push each to Docker Hub.
docker build -t gvellis/multi-client:latest -t gvellis/multi-client:$SHA -f ./client/Dockerfile ./client
docker build -t gvellis/multi-server:latest -t gvellis/multi-server:$SHA -f ./server/Dockerfile ./server
docker build -t gvellis/multi-worker:latest -t gvellis/multi-worker:$SHA -f ./worker/Dockerfile ./worker
# push each Image to Docker Hub.
docker push gvellis/multi-client:latest
docker push gvellis/multi-server:latest
docker push gvellis/multi-worker:latest

docker push gvellis/multi-client:$SHA
docker push gvellis/multi-server:$SHA
docker push gvellis/multi-worker:$SHA

# 8. Apply all configs in the 'k8s' folder.
kubectl apply -f k8s

# 9. Imperatively set latest Images on each deployment.



#                 the 'object' type we
#                 want to update
#                 |
#                 |          The name of our Deployment
#                 |          (see: server-deployment.yml -> metadata/name)
#                 |          |
#                 |          |                 We select the server container
#                 |          |                 |
#                 |          |                 |      And we tell server container,
#                 |          |                 |      to use the Image: { my Docker ID } / multi-server
kubectl set image deployments/server-deployment server=gvellis/multi-server:$SHA
kubectl set image deployments/client-deployment client=gvellis/multi-client:$SHA
#                                              The worker Container needs to use the Image: "gvellis/multi-worker:$SHA"
#                                              |
kubectl set image deployments/worker-deployment worker=gvellis/multi-worker:$SHA
