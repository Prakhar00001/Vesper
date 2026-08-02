from langchain_core.prompts import ChatPromptTemplate
from config import get_llm
from models import ResearchPlan, ResearchState

PLANNER_PROMPT = """You are an elite Lead Research Director. 
Decompose the topic below into 4-7 specific, mutually exclusive sub-questions.
Formulate a rigorous plan with clear success criteria.

Topic: {topic}
"""

async def planner_agent(state: ResearchState) -> dict:
    llm = get_llm(state.get("provider"), state.get("model_name"))
    structured_llm = llm.with_structured_output(ResearchPlan)
    prompt = ChatPromptTemplate.from_template(PLANNER_PROMPT)
    chain = prompt | structured_llm
    
    plan: ResearchPlan = await chain.ainvoke({"topic": state["topic"]})
    return {
        "plan": plan,
        "logs": state.get("logs", []) + [{
            "agent": "Planner Agent",
            "status": "completed",
            "message": f"Generated plan with {len(plan.sub_questions)} sub-questions."
        }]
    }