#!/usr/bin/env bash
set -ex

echo "PORT=$PORT"

echo "Running DB migrations..."
python -m app.db.initialize

echo "Checking uvicorn..."
which uvicorn
uvicorn --version

echo "Starting server..."
exec uvicorn app.app:app --host 0.0.0.0 --port "$PORT" --log-level debug