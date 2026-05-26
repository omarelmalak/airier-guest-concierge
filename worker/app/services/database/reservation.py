from app.services.database.base import Database
from psycopg2.extras import RealDictCursor

class ReservationDatabase(Database):
    def get_active_reservation_by_phone(self, phone: str, *, property_id: str | None = None, conn=None):
        with self.ensure_connection(conn) as c:
            with c.cursor(cursor_factory=RealDictCursor) as cur:
                if property_id:
                    cur.execute(
                        """
                        SELECT
                        r.id AS reservation_id,
                        r.is_active AS is_active,
                        c.id AS conversation_id
                        FROM reservations r
                        JOIN guests g ON g.id = r.guest_id
                        JOIN properties p ON p.id = r.property_id
                        LEFT JOIN conversations c ON c.reservation_id = r.id
                        WHERE g.phone = %s
                        AND r.property_id = %s
                        AND r.is_active = true
                        ORDER BY r.check_in DESC
                        LIMIT 1;
                        """,
                        (phone, property_id),
                    )
                else:
                    cur.execute(
                        """
                        SELECT
                        r.id AS reservation_id,
                        r.is_active AS is_active,
                        c.id AS conversation_id
                        FROM reservations r
                        JOIN guests g ON g.id = r.guest_id
                        JOIN properties p ON p.id = r.property_id
                        LEFT JOIN conversations c ON c.reservation_id = r.id
                        WHERE g.phone = %s
                        AND r.is_active = true
                        ORDER BY r.check_in DESC
                        LIMIT 1;
                        """,
                        (phone,),
                    )
                row = cur.fetchone()
                return row