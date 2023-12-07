#!/bin/bash

# Exit on any error
set -e

# Log in to the Heroku container registry
pnpm heroku container:login

# Build and push the Docker image to heroku
pnpm heroku container:push web --app huddle-api --context-path ./

# Release the Docker image
pnpm heroku container:release web --app huddle-api
