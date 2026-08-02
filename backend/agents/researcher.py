from typing import List
from tools.search import SearchEngine
from models import ResearchState, EvidenceItem

search_engine = SearchEngine()

async def researcher_agent(state: ResearchState) -> dict:
    plan = state["plan"]
    existing_evidence = list(state.get("evidence", []))
    critic_feedback = state.get("critic_feedback")
    
    # Target new sub-questions or address critic gaps
    queries_to_run = plan.sub_questions
    if critic_feedback and critic_feedback.missing_aspects:
        queries_to_run = critic_feedback.missing_aspects

    new_evidence: List[EvidenceItem] = []
    for sub_q in queries_to_run:
        results = await search_engine.execute_search(query=f"{state['topic']} {sub_q}", sub_question=sub_q)
        new_evidence.extend(results)

    combined = existing_evidence + new_evidence
    return {
        "evidence": combined,
        "logs": state.get("logs", []) + [{
            "agent": "Research Agent",
            "status": "completed",
            "message": f"Retrieved {len(new_evidence)} new evidence items across targets."
        }]
    }