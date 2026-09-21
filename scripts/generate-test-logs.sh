#!/bin/bash

SERVICES=(
    "payment-service"
    "auth-service"
    "order-service"
    "api-gateway"
)

LEVELS=(
    "INFO"
    "INFO"
    "INFO"
    "WARN"
    "ERROR"
)

MESSAGES=(
    "Request completed successfully"
    "User authentication completed"
    "Database query completed"
    "Response time exceeded threshold"
    "Connection timeout detected"
    "Payment processing completed"
    "Order created successfully"
    "External API request completed"
)

for i in {1..40}
do

    SERVICE=${
        SERVICES[
            $RANDOM %
            ${#SERVICES[@]}
        ]
    }

    LEVEL=${
        LEVELS[
            $RANDOM %
            ${#LEVELS[@]}
        ]
    }

    MESSAGE=${
        MESSAGES[
            $RANDOM %
            ${#MESSAGES[@]}
        ]
    }

    curl -s \
        -X POST \
        http://localhost:8080/api/logs \
        -H "Content-Type: application/json" \
        -d "{
            \"service\":\"$SERVICE\",
            \"level\":\"$LEVEL\",
            \"message\":\"$MESSAGE\",
            \"traceId\":\"trace-$i\",
            \"environment\":\"production\",
            \"host\":\"server-$((RANDOM % 5 + 1))\"
        }"

    echo

    sleep 0.3

done

echo "Finished generating logs."