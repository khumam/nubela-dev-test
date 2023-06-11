docker run \
	--rm \
	--network none \
	-v $(pwd)/sock:/var/run/dev-test \
	nubelacorp/dev-test:stable \
	/var/run/dev-test/sock