from fastapi import APIRouter, Depends, status

from ...auth.permissions import has_permissions
from ...services.auth import users as user_services
from ...models.auth import users as user_models


router = APIRouter(
    tags=['Users'],
    prefix="/users",
    responses={404: {"description": "Not found"}},
)

@router.post('/', status_code=status.HTTP_201_CREATED, dependencies=[Depends(has_permissions(['PERSONNEL ADMINISTRATIF']))])
async def create_user(payload: user_models.CreateUser):
    return await user_services.create_user(payload.model_dump())

@router.get('/', status_code=status.HTTP_200_OK, dependencies=[Depends(has_permissions(['PERSONNEL ADMINISTRATIF']))])
async def get_users(search: str = '', page: int = 1, limit: int = 10):
    return await user_services.get_users(search, page, limit)

@router.get('/{user_id}', status_code=status.HTTP_200_OK, dependencies=[Depends(has_permissions(['PERSONNEL ADMINISTRATIF']))])
async def get_user_by_id(user_id: str):
    return await user_services.get_user_by_id(user_id)

@router.put('/{user_id}', status_code=status.HTTP_200_OK, dependencies=[Depends(has_permissions(['PERSONNEL ADMINISTRATIF']))])
async def update_user(user_id: str, payload: user_models.UpdateUser):
    return await user_services.update_user(user_id, payload.model_dump())
