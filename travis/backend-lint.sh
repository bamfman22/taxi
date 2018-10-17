#!/bin/bash

# shellcheck source=./utils.sh
source "$TRAVIS_BUILD_DIR/travis/utils.sh"
set -ev

if contains_backend ; then
  echo "travis_fold:start:Backend Linting"
  cd "$TRAVIS_BUILD_DIR/backend"
  black --diff --check taxi
  echo "travis_fold:end:Backend Linting"
fi
