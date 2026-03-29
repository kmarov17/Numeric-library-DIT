from typing import List
from datetime import timedelta, datetime
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

from ..models.auth.auth import DataToken
from ..utils import db_utils as db
from ..configs.settings import SECRET_KEY, ACCESS_TOKEN_EXPIRE_HOURS
from ..configs.tables import Users


oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/api/auth/login')

ALGORITHM = "HS256"

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now() + timedelta(hours=int(ACCESS_TOKEN_EXPIRE_HOURS))
    to_encode.update({"expire": expire.strftime("%Y-%m-%d %H:%M:%S")})

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, ALGORITHM)

    return encoded_jwt


def verify_token_access(token: str, credentials_exception):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)

        user_id: str = payload.get("id")
        permissions: List[str] = payload.get("permissions")

        if user_id is None or permissions is None:
            raise credentials_exception
        token_data = DataToken(id=user_id, permissions = permissions)
    except JWTError as e:
        print(e)
        raise credentials_exception

    return token_data


async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not Validate Credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    token = verify_token_access(token, credentials_exception)

    user = await db.get_by_id(Users, token.id)

    if user is None:
        raise credentials_exception

    return {
        "user": user,
        "permissions": token.permissions
    }


def has_permissions(required_permissions: List[str]):
    """
    Decorator to verify if the current user has the required permissions.
    :param required_permissions: List of roles required to access the resource.
    """
    def permission_decorator(
        current_user: Users = Depends(get_current_user)
    ):
        user_permissions = current_user["permissions"]

        if not any(permission in user_permissions for permission in required_permissions):
            print(f"***[INFO]*** Checking permissions for user ID: {current_user['user'].id}")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have the necessary permissions to access this resource.",
            )
        return current_user

    return permission_decorator
