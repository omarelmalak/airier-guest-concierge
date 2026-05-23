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

    def get_conversation_history(self, conversation_id: str, *, conn=None):
        """All messages in a conversation, oldest first."""
        with self.ensure_connection(conn) as c:
            with c.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(
                    """
                    SELECT role, content
                    FROM texts
                    WHERE conversation_id = %s
                    ORDER BY COALESCE(sent_at, created_at) ASC
                    """,
                    (conversation_id,),
                )
                return cur.fetchall()