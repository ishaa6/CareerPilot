set -e
echo "Running DB migrations..."
python -m app.db.initialize 2>/dev/null || true
echo "Starting server..."
exec uvicorn app.app:app --host 0.0.0.0 --port "${PORT:-8000}"
