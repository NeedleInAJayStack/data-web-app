#!/bin/sh
set -euo pipefail

# This script requires a single argument that points to the directory the built files should be copied to.
# 
# Example usage:
# ./deploy.sh ~/dev/Swift/API/Public

if [ -z $1 ]; then
  echo "Path to destination directory was not provided"
  exit 1
fi

npm run build
DESTINATION=${1%*/}/
echo "Deleting $DESTINATION"
rm -R $DESTINATION
echo "Copying build to $DESTINATION"
cp -R build/ $DESTINATION
echo "Deployed successfully!"
