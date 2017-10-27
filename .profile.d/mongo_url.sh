  #!/bin/bash
  if [ -z $MONGO_URL ] ; then
    export MONGO_URL=${MONGODB_URI:-${MONGOLAB_URI:-$MONGOHQ_URL}}
  fi
  if [ -z $MONGO_URL ] ; then
    echo "meteor-buildpack-horse: MONGO_URL missing, you must define it for meteor to work."
  fi
