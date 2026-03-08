-- Run this as a PostgreSQL superuser (e.g. postgres) to fix P1010 access denied.
-- First create the database if needed:  CREATE DATABASE syncpad;
-- Then connect to syncpad and run the rest (or run as postgres with -d syncpad).

-- Grant connect (run while connected to a DB that user can access, e.g. postgres)
GRANT CONNECT ON DATABASE syncpad TO "user";

-- Grant usage and full access on public schema (run while connected to syncpad)
GRANT USAGE ON SCHEMA public TO "user";
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "user";
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO "user";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO "user";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO "user";
