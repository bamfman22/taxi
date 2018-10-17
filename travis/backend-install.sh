#!/bin/bash

# shellcheck source=./utils.sh
source "$TRAVIS_BUILD_DIR/travis/utils.sh"
set -ev

if contains_backend ; then
  echo "travis_fold:start:Backend Install"
  cd "$TRAVIS_BUILD_DIR/backend"
  pip install -r requirements.txt
  pip install -r requirements-dev.txt
  echo "travis_fold:end:Backend Install"
fi
