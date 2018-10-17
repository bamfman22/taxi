contains_frontend() {
  return $(contains "^frontend")
}

contains_backend() {
  return $(contains "^backend")
}

contains() {
  QUERY="$1"
  git diff --name-only master HEAD | grep "$QUERY" > /dev/null 2>&1

  return "$?"
}
