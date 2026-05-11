"""
TradeOS Supabase deployment script.
Run from any machine that can reach the Supabase database.

Usage:
    python deploy.py            # runs schema.sql then seed.sql
    python deploy.py --schema   # schema only
    python deploy.py --seed     # seed only
    python deploy.py --check    # verify tables and row counts

Connection: reads from .env.local in the same dir as app/ or from env vars.
Requires: pip install psycopg2-binary python-dotenv
"""

import os, sys, pathlib, argparse

# ---------------------------------------------------------------------------
# Locate env and SQL files
# ---------------------------------------------------------------------------
_here = pathlib.Path(__file__).parent
_app_root = _here.parent

def _load_env():
    env_file = _app_root / ".env.local"
    if env_file.exists():
        for line in env_file.read_text().splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip())

_load_env()

DB_PASSWORD = os.environ.get("SUPABASE_DB_PASSWORD", "")
PROJECT_REF = "rbkmrwmjqxqyllmxvfip"
DATABASE_URL = os.environ.get("DATABASE_URL", "")

SCHEMA_SQL = (_here / "schema.sql").read_text()
SEED_SQL   = (_here / "seed.sql").read_text()

# ---------------------------------------------------------------------------
# Connection candidates (try in order)
# ---------------------------------------------------------------------------
CONN_CANDIDATES = [
    # Direct (older projects)
    dict(host=f"db.{PROJECT_REF}.supabase.co", port=5432,
         user="postgres", password=DB_PASSWORD),
    # Session pooler — us-east-1
    dict(host="aws-0-us-east-1.pooler.supabase.com", port=5432,
         user=f"postgres.{PROJECT_REF}", password=DB_PASSWORD),
    # Session pooler — us-east-2
    dict(host="aws-0-us-east-2.pooler.supabase.com", port=5432,
         user=f"postgres.{PROJECT_REF}", password=DB_PASSWORD),
    # Transaction pooler — us-east-1
    dict(host="aws-0-us-east-1.pooler.supabase.com", port=6543,
         user=f"postgres.{PROJECT_REF}", password=DB_PASSWORD),
]

def _connect():
    try:
        import psycopg2
    except ImportError:
        print("psycopg2 not installed — run: pip install psycopg2-binary")
        sys.exit(1)

    for c in CONN_CANDIDATES:
        try:
            conn = psycopg2.connect(
                host=c["host"], port=c["port"],
                dbname="postgres", user=c["user"], password=c["password"],
                connect_timeout=12, sslmode="require"
            )
            print(f"Connected: {c['host']}:{c['port']}")
            conn.autocommit = True
            return conn
        except Exception as e:
            print(f"  skip {c['host']}:{c['port']} — {e}")

    print("\nAll connection attempts failed.")
    print("Fallback: paste schema.sql + seed.sql into Supabase SQL Editor at:")
    print(f"  https://supabase.com/dashboard/project/{PROJECT_REF}/sql/new")
    sys.exit(1)

def _exec(conn, label, sql):
    cur = conn.cursor()
    try:
        cur.execute(sql)
        print(f"{label}: OK")
    except Exception as e:
        print(f"{label} error: {e}")
    finally:
        cur.close()

def _check(conn):
    cur = conn.cursor()
    cur.execute("SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename")
    tables = [r[0] for r in cur.fetchall()]
    print(f"Tables: {tables}")
    for t in ["crew", "jobs", "materials", "invoices"]:
        if t in tables:
            cur.execute(f"SELECT count(*) FROM {t}")
            print(f"  {t}: {cur.fetchone()[0]} rows")
        else:
            print(f"  {t}: MISSING")
    cur.close()

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--schema", action="store_true")
    ap.add_argument("--seed",   action="store_true")
    ap.add_argument("--check",  action="store_true")
    args = ap.parse_args()

    run_schema = args.schema or (not args.seed and not args.check)
    run_seed   = args.seed   or (not args.schema and not args.check)

    conn = _connect()

    if run_schema:
        _exec(conn, "schema.sql", SCHEMA_SQL)
    if run_seed:
        _exec(conn, "seed.sql", SEED_SQL)
    if args.check or (run_schema or run_seed):
        _check(conn)

    conn.close()
    print("Done.")
