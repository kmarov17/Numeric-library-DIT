from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from ...configs.tables import Users
from ...utils import db_utils as db
from ...models.auth.auth import Token
from ...utils.users_utils import verify_password
from ...auth.permissions import create_access_token, get_current_user, has_permissions


router = APIRouter(
    tags=['Authentication'],
    prefix="/auth",
    responses={404: {"description": "Not found"}},
)

@router.post('/login', status_code=status.HTTP_200_OK, response_model=Token)
async def login(userdetails: OAuth2PasswordRequestForm = Depends()):
    user = await db.get_by_field(Users, 'email', userdetails.username)

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="The User Does not exist")
    
    if user.is_active is False:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User account deactivated. Please contact admin.")

    if not verify_password(userdetails.password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="The Passwords do not match")

    to_encode = {
        "id": str(user.id),
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "is_active": user.is_active,
        "type": user.type,
        "program": user.program,
        "created_at": str(user.created_at),
        "updated_at": str(user.updated_at),
        "permissions": [
            "default",
            user.type
        ]
    }
    access_token = create_access_token(to_encode)

    return {"access_token": access_token, "token_type": "bearer"}

@router.get('/me', status_code=status.HTTP_200_OK, dependencies=[Depends(has_permissions(['default']))])
async def get_current_user(current_user=Depends(get_current_user)):
    return current_user['user']