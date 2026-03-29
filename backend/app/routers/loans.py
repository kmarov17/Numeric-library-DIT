from fastapi import APIRouter, Depends, status

from ..auth.permissions import has_permissions
from ..services import loans as loan_services
from ..models import loans as loan_models


router = APIRouter(
    tags=['Loans'],
    prefix="/loans",
    responses={404: {"description": "Not found"}},
)

@router.post('/', status_code=status.HTTP_201_CREATED, dependencies=[Depends(has_permissions(['PERSONNEL ADMINISTRATIF']))])
async def create_loan(payload: loan_models.CreateLoan):
    return await loan_services.create_loan(payload.model_dump())

@router.get('/', status_code=status.HTTP_200_OK, dependencies=[Depends(has_permissions(['default']))])
async def get_loans(search: str = '', page: int = 1, limit: int = 10):
    return await loan_services.get_loans(search, page, limit)

@router.get('/{loan_id}', status_code=status.HTTP_200_OK, dependencies=[Depends(has_permissions(['PERSONNEL ADMINISTRATIF']))])
async def get_loan_by_id(loan_id: str):
    return await loan_services.get_loan_by_id(loan_id)

@router.patch('/{loan_id}', status_code=status.HTTP_200_OK, dependencies=[Depends(has_permissions(['PERSONNEL ADMINISTRATIF']))])
async def patch_loan(loan_id: str, payload: loan_models.UpdateLoan):
    return await loan_services.patch_loan(loan_id, payload.model_dump())
