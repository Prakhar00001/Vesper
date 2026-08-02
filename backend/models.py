from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from typing_extensions import TypedDict

class EvidenceItem(BaseModel):
    title: str
    url: str
    snippet: str
    sub_question: str

class ResearchPlan(BaseModel):
    sub_questions: List[str] = Field(description="4-7 targeted research sub-questions")
    methodology: str = Field(description="Strategic research execution approach")
    success_criteria: List[str] = Field(description="Quality benchmarks for the report")

class CriticFeedback(BaseModel):
    approved: bool = Field(description="Whether evidence is sufficient for report generation")
    missing_aspects: List[str] = Field(default_factory=list, description="Gaps identified")
    critique: str = Field(description="Detailed evaluation of gathered facts and citations")

class AgentLog(BaseModel):
    agent: str
    status: str
    message: str
    timestamp: float

class ResearchState(TypedDict):
    topic: str
    provider: str
    model_name: str
    plan: Optional[ResearchPlan]
    evidence: List[EvidenceItem]
    critic_feedback: Optional[CriticFeedback]
    iteration_count: int
    max_iterations: int
    draft: str
    final_report: str
    logs: List[Dict[str, Any]]