docker build -t member:latest .
docker rmi $(docker images -f dangling=true -q)