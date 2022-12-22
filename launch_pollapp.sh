#! /bin/bash
# Made by Simon Wilmots

echo
echo "=========================================="
echo "Starting Pollapp container "
echo "=========================================="
echo

docker build -t pollapp:latest . &&
docker run --rm -p  5050:5050 --name pollapp pollapp:latest