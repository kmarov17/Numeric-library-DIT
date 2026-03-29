from pydantic import BaseModel


class Users(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str
    type: str
    is_active: bool = True
    program: str

class CreateUser(Users):
    pass

class UpdateUser(Users):
    pass
