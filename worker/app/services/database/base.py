import contextlib
import os
from datetime import datetime

import psycopg2
from psycopg2.extras import RealDictCursor

class Database:
    @contextlib.contextmanager
    def get_conn(self):
        """Context manager that yields a DB connection. Use for a single block or pass the conn to helpers."""
        database_url = os.environ.get("DATABASE_URL")
        if not database_url:
            raise ValueError("DATABASE_URL required")
        conn = psycopg2.connect(database_url)
        try:
            yield conn
        finally:
            conn.close()


    @contextlib.contextmanager
    def ensure_connection(self, conn=None):
        """Use the given connection or open a new one. Caller must not close the passed-in conn."""
        if conn is not None:
            yield conn
            return
        with self.get_conn() as c:
            yield c

    def lock_advisory_lock(self, lock_key: int, *, conn=None):
        with self.ensure_connection(conn) as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("SELECT pg_try_advisory_lock(%s) AS locked", (lock_key,))
                row = cur.fetchone()
                return row["locked"] if row else None