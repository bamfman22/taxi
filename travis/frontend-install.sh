#!/bin/bash

# shellcheck source=./utils.sh
source "$TRAVIS_BUILD_DIR/travis/utils.sh"
set -ev

if contains_frontend ; then
  echo "travis_fold:start:Frontend Install"
  cd "$TRAVIS_BUILD_DIR/frontend"
  curl -o- -L https://yarnpkg.com/install.sh | bash -s
  yarn install
  echo "travis_fold:end:Frontend Install"
fi
