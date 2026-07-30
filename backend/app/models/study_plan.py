from pydantic import BaseModel, Field
from typing import List, Optional

# --- Child Models ---

class KeyTerm(BaseModel):
    term: str = Field(description="The key technical term or concept")
    definition: str = Field(description="A concise definition based on the course materials")


class ContextChunk(BaseModel):
    chunk_id: str
    raw_text: str
    similarity_score: float = 0.0


class DailyTask(BaseModel):
    day: int = Field(description="Day number of the study plan, starting at 1")
    topic: str = Field(description="Main focus topic for this day")
    tasks: List[str] = Field(description="Actionable, step-by-step tasks to complete")
    est_study_time: int = Field(description="Estimated time required in minutes")


# --- Main Request & Response Models ---

class StudyPlanRequest(BaseModel):
    user_goal: str = Field(description="What the user wants to accomplish or learn")
    retrieved_chunks: List[ContextChunk] = Field(default_factory=list, description="Top context chunks retrieved by Member 3")
    target_duration_days: int = Field(default=7, description="Number of days the plan should cover")


class StudyPlanResponse(BaseModel):
    title: str = Field(description="A clear title for the generated study plan")
    summary: str = Field(description="A 2-sentence summary outlining the overall study strategy")
    daily_schedule: List[DailyTask] = Field(description="Day-by-day study schedule")
    key_terms: List[KeyTerm] = Field(description="Essential terms and concepts extracted from the material")
    is_context_sufficient: bool = Field(
        default=True, 
        description="Set to false if retrieved context chunks lacked enough detail to fulfill the user goal"
    )
    fallback_message: Optional[str] = Field(
        default=None, 
        description="Explanation or warning message if context was insufficient"
    )