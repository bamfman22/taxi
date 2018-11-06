#!/bin/bash

# shellcheck source=./utils.sh
source "$TRAVIS_BUILD_DIR/travis/utils.sh"
set -ev

if contains_frontend ; then
  echo "travis_fold:start:Frontend Testing"
  cd "$TRAVIS_BUILD_DIR/frontend"
  yarn test --ci --forceExit
  echo "travis_fold:end:Frontend Testing"
fi
