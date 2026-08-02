from langgraph.graph import StateGraph, END
from models import ResearchState
from agents.planner import planner_agent
from agents.researcher import researcher_agent
from agents.critic import critic_agent
from agents.writer import writer_agent

def should_continue(state: ResearchState) -> str:
    feedback = state.get("critic_feedback")
    iteration = state.get("iteration_count", 0)
    max_iters = state.get("max_iterations", 2)
    
    if feedback and not feedback.approved and iteration < max_iters:
        return "researcher"
    return "writer"

def build_research_graph():
    workflow = StateGraph(ResearchState)
    
    workflow.add_node("planner", planner_agent)
    workflow.add_node("researcher", researcher_agent)
    workflow.add_node("critic", critic_agent)
    workflow.add_node("writer", writer_agent)
    
    workflow.set_entry_point("planner")
    workflow.add_edge("planner", "researcher")
    workflow.add_edge("researcher", "critic")
    
    workflow.add_conditional_edges(
        "critic",
        should_continue,
        {
            "researcher": "researcher",
            "writer": "writer"
        }
    )
    
    workflow.add_edge("writer", END)
    return workflow.compile()

research_graph = build_research_graph()