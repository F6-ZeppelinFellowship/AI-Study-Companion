from fastapi import APIRouter, HTTPException, status
from app.models.study_plan import StudyPlanRequest, StudyPlanResponse
from app.services.llm_service import generate_study_plan

router = APIRouter(prefix="/generator", tags=["generator"])

@router.post("/study-plan", 
             response_model=StudyPlanResponse, 
             status_code=status.HTTP_200_OK, 
             summary="Generate a structured study plan based on user goal and retrieved context.", 
             description="This endpoint takes a user goal, target duration, and retrieved context chunks to generate a structured study plan. The response is validated against the StudyPlanResponse schema."
            )
async def create_study_plan(request: StudyPlanRequest)-> StudyPlanResponse:
    try:
        plan = generate_study_plan(request)
        return plan
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail=str(ve)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Failed to generate study plan: {str(e)}"
        )
    