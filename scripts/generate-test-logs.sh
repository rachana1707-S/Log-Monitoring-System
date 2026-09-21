#!/bin/bash

SERVICES=(
  "api-gateway"
  "auth-service"
  "order-service"
  "payment-service"
)

LEVELS=(
  "INFO"
  "INFO"
  "INFO"
  "WARN"
  "ERROR"
)

MESSAGES=(
  "Incoming API request received"
  "User authentication completed"
  "Order created successfully"
  "Payment processed successfully"
  "Database query completed"
  "Response time exceeded threshold"
  "External service responded slowly"
  "Payment gateway timeout"
  "Database connection failed"
  "Unauthorized request detected"
)

echo "Generating LogPulse test traffic..."
echo

for i in {1..50}
do
  SERVICE=${SERVICES[$RANDOM % ${#SERVICES[@]}]}
  LEVEL=${LEVELS[$RANDOM % ${#LEVELS[@]}]}
  MESSAGE=${MESSAGES[$RANDOM % ${#MESSAGES[@]}]}
  HOST="server-$((RANDOM % 4 + 1))"
  TRACE_ID="trace-$i"

  curl -s -X POST http://localhost:8080/api/logs \
    -H "Content-Type: application/json" \
    -d "{
      \"service\":\"$SERVICE\",
      \"level\":\"$LEVEL\",
      \"message\":\"$MESSAGE\",
      \"traceId\":\"$TRACE_ID\",
      \"environment\":\"production\",
      \"host\":\"$HOST\"
    }"

  echo

  sleep 0.2
done

echo
echo "Finished generating 50 logs."