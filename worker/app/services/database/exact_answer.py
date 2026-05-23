from app.services.database.base import Database
from psycopg2.extras import RealDictCursor


def vector_literal(embedding: list[float]) -> str:
    return "[" + ",".join("%.8g" % x for x in embedding) + "]"


class ExactAnswerDatabase(Database):
    def get_property_id_for_text(self, text_id: str, *, conn=None):
        with self.ensure_connection(conn) as c:
            with c.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(
                    """
                    SELECT r.property_id
                    FROM texts t
                    JOIN conversations c ON c.id = t.conversation_id
                    JOIN reservations r ON r.id = c.reservation_id
                    WHERE t.id = %s
                    """,
                    (text_id,),
                )
                row = cur.fetchone()
                return row["property_id"] if row else None

    def find_best_match(self, property_id: str, query_embedding: list[float], *, conn=None):
        """
        Return the closest exact_answer row for this property by cosine similarity,
        or None if there are no embedded rows.
        """
        literal = vector_literal(query_embedding)
        with self.ensure_connection(conn) as c:
            with c.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(
                    """
                    SELECT
                        id,
                        question,
                        answer,
                        1 - (question_embedding <=> %s::vector) AS similarity
                    FROM exact_answers
                    WHERE property_id = %s
                      AND question_embedding IS NOT NULL
                    ORDER BY question_embedding <=> %s::vector
                    LIMIT 1
                    """,
                    (literal, property_id, literal),
                )
                return cur.fetchone()
