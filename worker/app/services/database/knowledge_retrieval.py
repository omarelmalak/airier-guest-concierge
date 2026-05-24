from app.services.database.base import Database
from psycopg2.extras import RealDictCursor

UNIFIED_EMBEDDINGS_SQL = """
SELECT
    'exact' AS source,
    ea.answer AS payload,
    ea.question AS exact_question,
    NULL::text AS description,
    NULL::text AS feature_name,
    NULL::text AS category_name,
    ea.question_embedding::text AS embedding
FROM exact_answers ea
WHERE ea.property_id = %s
  AND ea.question_embedding IS NOT NULL

UNION ALL

SELECT
    'feature' AS source,
    NULL::text AS payload,
    NULL::text AS exact_question,
    kcf.description AS description,
    f.name AS feature_name,
    kc.name AS category_name,
    kcf.description_embedding::text AS embedding
FROM knowledge_category_features kcf
JOIN features f ON f.id = kcf.feature_id
JOIN knowledge_categories kc ON kc.id = kcf.knowledge_category_id
WHERE kcf.property_id = %s
  AND kcf.description_embedding IS NOT NULL

UNION ALL

SELECT
    'freeform' AS source,
    NULL::text AS payload,
    NULL::text AS exact_question,
    pkc.description AS description,
    kc.name AS feature_name,
    kc.name AS category_name,
    pkc.description_embedding::text AS embedding
FROM property_knowledge_categories pkc
JOIN knowledge_categories kc ON kc.id = pkc.knowledge_category_id
WHERE pkc.property_id = %s
  AND pkc.description_embedding IS NOT NULL
"""


class KnowledgeRetrievalDatabase(Database):
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

    def fetch_embedded_sources(self, property_id: str, *, conn=None) -> list[dict]:
        with self.ensure_connection(conn) as c:
            with c.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(UNIFIED_EMBEDDINGS_SQL, (property_id, property_id, property_id))
                return cur.fetchall()
