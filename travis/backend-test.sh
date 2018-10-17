#!/bin/bash

# shellcheck source=./utils.sh
source "$TRAVIS_BUILD_DIR/travis/utils.sh"
set -ev

if contains_backend ; then
  echo "travis_fold:start:Backend Testing"
  cd "$TRAVIS_BUILD_DIR/backend"
  pytest
  echo "travis_fold:end:Backend Testing"
fi
