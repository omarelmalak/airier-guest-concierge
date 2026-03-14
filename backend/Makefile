.PHONY: install dev server

install:
	bundle install

# Run Rails server with env from Doppler
dev: server

server:
	doppler run -- ./bin/rails server
