from langchain_core.prompts import ChatPromptTemplate
from config import get_llm
from models import ResearchState

WRITER_PROMPT = """You are an Elite Research Analyst. Synthesize the collected evidence into an exhaustive, highly polished Markdown research report.

Topic: {topic}
Plan: {plan_str}
Evidence:
{evidence_str}

Ensure the report includes:
1. Executive Summary
2. Introduction & Background
3. Main Thematic Sections (aligned with sub-questions)
4. Critical Analysis & Counter-perspectives
5. Conclusion & Future Outlook
6. References & Sources Section with inline citations [1], [2], etc.
"""

async def writer_agent(state: ResearchState) -> dict:
    llm = get_llm(state.get("provider"), state.get("model_name"))
    evidence_str = "\n".join([f"[{i+1}] {e.title} ({e.url}): {e.snippet}" for i, e in enumerate(state.get("evidence", []))])
    plan_str = ", ".join(state["plan"].sub_questions) if state.get("plan") else ""
    
    prompt = ChatPromptTemplate.from_template(WRITER_PROMPT)
    chain = prompt | llm
    
    response = await chain.ainvoke({
        "topic": state["topic"],
        "plan_str": plan_str,
        "evidence_str": evidence_str
    })
    
    report_content = response.content if hasattr(response, "content") else str(response)
    
    return {
        "final_report": report_content,
        "logs": state.get("logs", []) + [{
            "agent": "Writer Agent",
            "status": "completed",
            "message": "Final multi-page research report synthesized successfully."
        }]
    }