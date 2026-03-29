from fastapi import APIRouter, Depends, status

from ..auth.permissions import has_permissions
from ..services import books as book_services
from ..models import books as book_models


router = APIRouter(
    tags=['Books'],
    prefix="/books",
    responses={404: {"description": "Not found"}},
)

@router.post('/', status_code=status.HTTP_201_CREATED, dependencies=[Depends(has_permissions(['PERSONNEL ADMINISTRATIF']))])
async def create_book(payload: book_models.BooksIn):
    return await book_services.create_book(payload.model_dump())

@router.get('/', status_code=status.HTTP_200_OK, dependencies=[Depends(has_permissions(['default']))])
async def get_books(search: str = '', page: int = 1, limit: int = 10):
    return await book_services.get_books(search, page, limit)

@router.get('/{book_id}', status_code=status.HTTP_200_OK, dependencies=[Depends(has_permissions(['default']))])
async def get_book_by_id(book_id: str):
    return await book_services.get_book_by_id(book_id)

@router.put('/{book_id}', status_code=status.HTTP_200_OK, dependencies=[Depends(has_permissions(['PERSONNEL ADMINISTRATIF']))])
async def update_book(book_id: str, payload: book_models.BooksIn):
    return await book_services.update_book(book_id, payload.model_dump())

@router.delete('/{book_id}', status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(has_permissions(['PERSONNEL ADMINISTRATIF']))])
async def delete_book(book_id: str):
    return await book_services.delete_book(book_id)
