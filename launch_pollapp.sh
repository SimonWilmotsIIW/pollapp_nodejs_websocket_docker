#! /bin/bash
# Made by Simon Wilmots

echo
echo "=========================================="
echo "Starting Pollapp container "
echo "=========================================="
echo

docker build -t pollapp:latest .
docker run --rm -p  8080:8080 --name pollapp pollapp