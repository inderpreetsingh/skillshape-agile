  #!/bin/bash
  if [ -z "$ROOT_URL" ] && [ -n "$HEROKU_APP_NAME" ] ; then
    export ROOT_URL="https://.herokuapp.com"
  fi
