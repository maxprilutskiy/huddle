#!/bin/bash

# Exit on any error
set -e

# Log in to the Heroku container registry
heroku container:login

# Build and push the Docker image to heroku
heroku container:push web --app huddle-api --context-path ./

# Release the Docker image
heroku container:release web --app huddle-api
