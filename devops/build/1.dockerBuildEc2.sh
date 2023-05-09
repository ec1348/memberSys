# docker build
docker build -t member:latest .
# remove dangling image
if [ $(docker images -f dangling=true -q | wc -l) -gt 1 ]; then docker rmi -f $(docker images -f dangling=true -q); fi