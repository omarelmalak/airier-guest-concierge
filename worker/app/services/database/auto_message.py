from app.services.database.base import Database
from psycopg2.extras import RealDictCursor
from datetime import datetime

class AutoMessageDatabase(Database):
    def get_due_auto_messages(self, window_start: datetime, window_end: datetime, *, conn=None):
        with self.ensure_connection(conn) as c:
            with c.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(
                    """
                    SELECT id
                    FROM auto_messages
                    WHERE text_id IS NULL
                    AND send_at >= %s
                    AND send_at <= %s
                    ORDER BY send_at ASC
                    LIMIT 500
                    """,
                    (window_start, window_end),
                )
                return cur.fetchall()

    def get_auto_message_by_id(self, auto_message_id: str, *, conn=None):
        with self.ensure_connection(conn) as c:
            with c.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(
                    """
                    SELECT
                      am.id,
                      am.kind,
                      am.send_at,
                      am.text_id,
                      am.reservation_id,
                      g.phone AS guest_phone,
                      p.checkin_msg,
                      p.checkout_msg,
                      r.is_active AS is_active
                    FROM auto_messages am
                    JOIN reservations r ON r.id = am.reservation_id
                    JOIN guests g ON g.id = r.guest_id
                    JOIN properties p ON p.id = r.property_id
                    WHERE am.id = %s
                    """,
                    (auto_message_id,),
                )
                row = cur.fetchone()
                return row if row else None

    def update_auto_message_text_id(self, auto_message_id: str, text_id: str, *, conn=None):
        with self.ensure_connection(conn) as c:
            with c.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(
                    "UPDATE auto_messages SET text_id = %s WHERE id = %s",
                    (text_id, auto_message_id),
                )
                return cur.rowcount