from fastapi import HTTPException

from app.configs.tables import Users
from app.utils import db_utils as db
from app.utils.users_utils import hash_pass


async def create_user(payload):
    try:
        # Hash the password before storing
        payload["password"] = hash_pass(payload["password"])

        new_user = await db.create(Users, payload)
        return new_user
    except Exception as e:                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
            raise HTTPException(status_code=500, detail=f"Error creating user: {e}") from e
    
async def get_users(search: str, page: int, limit: int):
    try:
        filters = []
        if search:
            filters.append(Users.first_name.ilike(f"%{search}%") | Users.last_name.ilike(f"%{search}%") | Users.email.ilike(f"%{search}%"))
        users = await db.get_all(Users, filters=filters, order_by=Users.last_name, order_desc=False, page=page, per_page=limit)
        return users
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching users: {e}") from e

async def get_user_by_id(user_id: str):
    try:
        user = await db.get_by_id(Users, user_id)
        return user
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching user: {e}") from e

async def update_user(user_id: str, payload):
    try:
        # Hash the password before storing
        payload["password"] = hash_pass(payload["password"])

        updated_user = await db.update(Users, user_id, payload)
        if not updated_user:
            raise HTTPException(status_code=404, detail="User not found")
        return updated_user
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating user: {e}") from e