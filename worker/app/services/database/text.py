from app.services.database.base import Database
from psycopg2.extras import RealDictCursor
from datetime import datetime

class TextDatabase(Database):
    def store_text(self, conversation_id: str, provider_sid: str, body: str, role: str, sent_at: datetime, *, conn=None):
        with self.ensure_connection(conn) as c:
            with c.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(
                    """
                    INSERT INTO texts (conversation_id, provider_sid, content, role, sent_at)
                    VALUES (%s, %s, %s, %s, %s)
                    RETURNING id
                    """,
                    (conversation_id, provider_sid, body, role, sent_at),
                )
                row = cur.fetchone()
                return row["id"] if row else None