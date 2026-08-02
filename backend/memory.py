import aiosqlite
import json
from typing import Optional, List, Dict, Any

DB_PATH = "vesper_memory.db"

async def init_db():
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute("""
            CREATE TABLE IF NOT EXISTS sessions (
                id TEXT PRIMARY KEY,
                topic TEXT NOT NULL,
                report TEXT,
                state_data TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        await db.commit()

async def save_session(session_id: str, topic: str, report: str, state_data: dict):
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute(
            "INSERT OR REPLACE INTO sessions (id, topic, report, state_data) VALUES (?, ?, ?, ?)",
            (session_id, topic, report, json.dumps(state_data, default=str))
        )
        await db.commit()

async def get_all_sessions() -> List[Dict[str, Any]]:
    async with aiosqlite.connect(DB_PATH) as db:
        async with db.execute("SELECT id, topic, created_at FROM sessions ORDER BY created_at DESC") as cursor:
            rows = await cursor.fetchall()
            return [{"id": r[0], "topic": r[1], "created_at": r[2]} for r in rows]

async def get_session(session_id: str) -> Optional[Dict[str, Any]]:
    async with aiosqlite.connect(DB_PATH) as db:
        async with db.execute("SELECT id, topic, report, state_data FROM sessions WHERE id = ?", (session_id,)) as cursor:
            row = await cursor.fetchone()
            if row:
                return {"id": row[0], "topic": row[1], "report": row[2], "state_data": json.loads(row[3])}
            return None