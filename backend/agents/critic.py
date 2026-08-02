from langchain_core.prompts import ChatPromptTemplate
from config import get_llm
from models import CriticFeedback, ResearchState

CRITIC_PROMPT = """You are a meticulous Senior Fact-Checker & Peer Reviewer.
Evaluate the evidence gathered for the research topic: "{topic}".

Sub-questions Planned: {sub_questions}
Collected Evidence:
{evidence_str}

Assess whether the evidence is sufficient to author a comprehensive 5-10 page report.
Flag missing perspectives, potential hallucinations, or poor source quality.
If iteration count ({iteration_count}) is >= max_iterations ({max_iterations}), approve automatically with feedback noted.
"""

async def critic_agent(state: ResearchState) -> dict:
    llm = get_llm(state.get("provider"), state.get("model_name"))
    structured_llm = llm.with_structured_output(CriticFeedback)
    
    evidence_str = "\n".join([f"- [{e.title}]({e.url}): {e.snippet}" for e in state.get("evidence", [])])
    sub_qs = state["plan"].sub_questions if state.get("plan") else []
    
    prompt = ChatPromptTemplate.from_template(CRITIC_PROMPT)
    chain = prompt | structured_llm
    
    feedback: CriticFeedback = await chain.ainvoke({
        "topic": state["topic"],
        "sub_questions": ", ".join(sub_qs),
        "evidence_str": evidence_str,
        "iteration_count": state["iteration_count"],
        "max_iterations": state["max_iterations"]
    })
    
    return {
        "critic_feedback": feedback,
        "iteration_count": state["iteration_count"] + 1,
        "logs": state.get("logs", []) + [{
            "agent": "Critic Agent",
            "status": "completed",
            "message": f"Review complete. Approved: {feedback.approved}. Critique: {feedback.critique[:100]}..."
        }]
    }