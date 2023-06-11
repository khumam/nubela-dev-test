rm -R sock
docker run --rm --network none --memory 1g -v $(pwd)/sock:/var/run/dev-test khumam/dev-test /var/run/dev-test/sock