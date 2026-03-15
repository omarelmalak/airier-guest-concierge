from app.services.database.base import Database
from psycopg2.extras import RealDictCursor

class ConversationDatabase(Database):
    def create_conversation(self, reservation_id: str, *, conn=None):
        with self.ensure_connection(conn) as c:
            with c.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(
                    """
                    INSERT INTO conversations (reservation_id)
                    VALUES (%s)
                    RETURNING id
                    """,
                    (reservation_id,),
                )
                row = cur.fetchone()
                return row["id"] if row else None
    
    def get_conversation_id_by_reservation_id(self, reservation_id: str, *, conn=None):
        with self.ensure_connection(conn) as c:
            with c.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(
                    "SELECT id FROM conversations WHERE reservation_id = %s",
                    (reservation_id,),
                )
                row = cur.fetchone()
                return row["id"] if row else None

    def get_conversation_id_by_text_id(self, text_id: str, *, conn=None):
        with self.ensure_connection(conn) as c:
            with c.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(
                    """
                    SELECT conversation_id
                    FROM texts
                    WHERE id = %s
                    """,
                    (text_id,),
                )
                row = cur.fetchone()
                return row["conversation_id"] if row else None

