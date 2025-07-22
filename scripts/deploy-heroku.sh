#!/bin/bash

# Deploy to Heroku script for Travis CI
set -e

echo "Starting Heroku deployment..."

# Check if we're on the main branch
if [ "$TRAVIS_BRANCH" != "main" ]; then
    echo "Not on main branch, skipping deployment"
    exit 0
fi

# Check if this is a pull request
if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then
    echo "This is a pull request, skipping deployment"
    exit 0
fi

# Install Heroku CLI
echo "Installing Heroku CLI..."
curl https://cli-assets.heroku.com/install.sh | sh

# Login to Heroku
echo "Logging in to Heroku..."
echo $HEROKU_API_KEY | heroku auth:token

# Set Heroku app name
HEROKU_APP_NAME="university-library-${TRAVIS_BUILD_NUMBER}"

# Create new Heroku app
echo "Creating new Heroku app: $HEROKU_APP_NAME"
heroku create $HEROKU_APP_NAME

# Add PostgreSQL addon
echo "Adding PostgreSQL addon..."
heroku addons:create heroku-postgresql:mini --app $HEROKU_APP_NAME

# Add Redis addon
echo "Adding Redis addon..."
heroku addons:create heroku-redis:mini --app $HEROKU_APP_NAME

# Add Kafka addon (if available)
echo "Adding Kafka addon..."
heroku addons:create heroku-kafka:mini --app $HEROKU_APP_NAME || echo "Kafka addon not available, skipping..."

# Set environment variables
echo "Setting environment variables..."
heroku config:set SPRING_PROFILES_ACTIVE=prod --app $HEROKU_APP_NAME
heroku config:set JAVA_OPTS="-Xmx512m -Xss512k" --app $HEROKU_APP_NAME

# Deploy the application
echo "Deploying application..."
git push heroku main

# Run database migrations
echo "Running database migrations..."
heroku run java -jar target/library-management-*.jar --spring.profiles.active=prod --spring.jpa.hibernate.ddl-auto=validate

# Check if deployment was successful
echo "Checking deployment status..."
heroku ps --app $HEROKU_APP_NAME

echo "Deployment completed successfully!"
echo "App URL: https://$HEROKU_APP_NAME.herokuapp.com" 