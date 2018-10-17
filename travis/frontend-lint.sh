#!/bin/bash

# shellcheck source=./utils.sh
source "$TRAVIS_BUILD_DIR/travis/utils.sh"
set -ev

if contains_frontend ; then
  echo "travis_fold:start:Frontend Linting"
  cd "$TRAVIS_BUILD_DIR/frontend"
  yarn run prettier -l --single-quote "src/**/*.{js,jsx,json,css}"
  echo "travis_fold:end:Frontend Linting"
fi
