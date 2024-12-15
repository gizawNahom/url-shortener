#!/bin/bash
echo "Running load test..."
npx artillery run ./packages/server/tests/restapi-load/load-test.yml
EXIT_CODE=$?
echo $EXIT_CODE
echo "Load test finished"
if [ $EXIT_CODE -eq 21 ] || [ $EXIT_CODE -eq 0 ]; then
  echo "Load test succeeded"
  exit 0
else
  echo "Load test failed"
  exit $EXIT_CODE
fi
