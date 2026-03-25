#!/bin/sh
# Exit on first error and fail on undefined variables.
set -eu

# The app expects config/.env to exist. Build it from env vars when running in containers.
if [ ! -f /app/config/.env ]; then
  # Enforce required variables at startup.
  : "${MONGO_URI:?MONGO_URI is required}"
  : "${JWT_SECRET:?JWT_SECRET is required}"

  # Generate config/.env from container environment variables.
  cat > /app/config/.env <<EOF
MONGO_URI=${MONGO_URI}
JWT_SECRET=${JWT_SECRET}
HTTP_PORT=${HTTP_PORT:-5000}
EOF
fi

# Replace the shell with the Node.js process (PID 1).
exec node index.js
