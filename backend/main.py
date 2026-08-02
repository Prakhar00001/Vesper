import uuid
import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from graph import research_graph
from memory import init_db, save_session, get_all_sessions, get_session

app = FastAPI(title="Vesper Multi-Agent Research Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    await init_db()

class ResearchRequest(BaseModel):
    topic: str
    provider: str = "openai"
    model_name: str = "gpt-4o"

@app.post("/api/research")
async def start_research(req: ResearchRequest):
    job_id = str(uuid.uuid4())
    return {"job_id": job_id, "topic": req.topic, "status": "initialized"}

@app.get("/api/history")
async def list_history():
    return await get_all_sessions()

@app.get("/api/report/{session_id}")
async def fetch_report(session_id: str):
    data = await get_session(session_id)
    if not data:
        raise HTTPException(status_code=404, detail="Report not found")
    return data

@app.websocket("/ws/{job_id}")
async def websocket_research(websocket: WebSocket, job_id: str):
    await websocket.accept()
    try:
        data = await websocket.receive_json()
        topic = data.get("topic")
        provider = data.get("provider", "openai")
        model_name = data.get("model_name", "gpt-4o")

        initial_state = {
            "topic": topic,
            "provider": provider,
            "model_name": model_name,
            "plan": None,
            "evidence": [],
            "critic_feedback": None,
            "iteration_count": 0,
            "max_iterations": 2,
            "draft": "",
            "final_report": "",
            "logs": []
        }

        async for event in research_graph.astream(initial_state):
            for node_name, state_update in event.items():
                await websocket.send_json({
                    "type": "progress",
                    "node": node_name,
                    "logs": state_update.get("logs", []),
                    "evidence_count": len(state_update.get("evidence", [])),
                    "final_report": state_update.get("final_report", "")
                })

        final_state = await research_graph.ainvoke(initial_state)
        await save_session(job_id, topic, final_state["final_report"], final_state)

        await websocket.send_json({
            "type": "complete",
            "job_id": job_id,
            "final_report": final_state["final_report"]
        })

    except WebSocketDisconnect:
        print(f"Client disconnected: {job_id}")
    except Exception as e:
        await websocket.send_json({"type": "error", "message": str(e)})
        await websocket.close()