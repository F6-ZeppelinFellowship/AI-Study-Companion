import os
import json
from dotenv import load_dotenv
from openai import OpenAI
from app.models.study_plan import StudyPlanRequest, StudyPlanResponse

load_dotenv()

SYSTEM_PROMPT = """
You are an expert AI Study Companion and curriculum generator. 
Your primary task is to generate a structured, highly actionable study plan based strictly on the provided course material chunks.

RULES:
1. GROUNDING: Derive all daily tasks, topics, and key terms directly from the provided context chunks.
2. CONTEXT EVALUATION: 
   - If the provided context chunks contain sufficient information for the user's goal, set `is_context_sufficient` to true.
   - If no context chunks are provided, set `is_context_sufficient` to false and provide a clear `fallback_message`.
3. SOURCES: Include the `chunk_id` of every chunk used inside `sources_used`.
4. STRICT JSON: Return ONLY a valid JSON object matching the requested schema.
"""


def get_openrouter_client() -> OpenAI:
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise ValueError("OPENROUTER_API_KEY environment variable is not set.")

    return OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=api_key,
    )


def generate_study_plan(request: StudyPlanRequest) -> StudyPlanResponse:
    if request.retrieved_chunks:
        formatted_context_blocks = [
            f"[Chunk ID: {chunk.chunk_id} | Score: {chunk.similarity_score:.2f}]\n{chunk.raw_text}"
            for chunk in request.retrieved_chunks
        ]
        formatted_context = "\n\n---\n\n".join(formatted_context_blocks)
    else:
        formatted_context = "NO RETRIEVED CONTEXT AVAILABLE."

    user_prompt = f"USER GOAL: {request.user_goal}\nTARGET DURATION: {request.target_duration_days} days\nCONTEXT:\n{formatted_context}"

    client = get_openrouter_client()

    # 'openrouter/free' routes automatically to live zero-cost models
    response = client.chat.completions.create(
        model="openrouter/free",
        response_format={"type": "json_object"},
        messages=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT + "\nJSON Schema:\n" + json.dumps(StudyPlanResponse.model_json_schema()),
            },
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.2,
    )

    content = response.choices[0].message.content
    if not content:
        raise ValueError("Empty response from LLM provider.")

    raw_json = json.loads(content)
    return StudyPlanResponse(**raw_json)