#!/bin/bash
set -e

echo "🚀 Initializing PostgreSQL databases..."

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    SELECT 'CREATE DATABASE squadmakers_db_test'
    WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'squadmakers_db_test')\gexec
EOSQL

echo "✅ Test database created: squadmakers_db_test"

# psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
#     SELECT 'CREATE DATABASE squadmakers_db_e2e'
#     WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'squadmakers_db_e2e')\gexec
# EOSQL

echo "✅ All databases initialized successfully!"
