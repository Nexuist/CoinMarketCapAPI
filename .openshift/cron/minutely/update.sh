#!/bin/bash
# This script is run every minute
# But we only want it to run every 5 minutes
# So line 8 checks if the time ends in xx:x0 or xx:x5 and if not exits

# new LD_LIBRARY_PATH so node can run without the shared library error
export LD_LIBRARY_PATH=/opt/rh/v8314/root/usr/lib64:/opt/rh/nodejs010/root/usr/lib64

UPDATE_SCRIPT="$OPENSHIFT_REPO_DIR/update.js"

[ $(echo "`date +%M` % 5" | bc) -eq 0 ] || exit 0
# Regularly calling node doesn't work so...next best thing
node $UPDATE_SCRIPT
# Log the run time
date >> ${OPENSHIFT_NODEJS_LOG_DIR}/update.log
