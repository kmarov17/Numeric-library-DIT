from pydantic import BaseModel
from datetime import datetime


class Loans(BaseModel):
    book_id: str
    user_id: str
    borrowed_at: datetime
    due_date: datetime

class CreateLoan(Loans):
    pass

class UpdateLoan(BaseModel):
    notes: str
    