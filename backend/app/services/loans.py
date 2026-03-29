from fastapi import HTTPException
from datetime import datetime

from app.configs.tables import Loans, Books, Users
from app.utils import db_utils as db


async def create_loan(payload):
    try:
        new_loan = await db.create(Loans, payload)
        return new_loan
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating loan: {e}") from e

async def get_loans(search: str, page: int, limit: int):
    try:
        filters = []
        if search:
            filters.append(Loans.id.ilike(f"%{search}%") | Books.title.ilike(f"%{search}%") | Users.first_name.ilike(f"%{search}%") | Users.last_name.ilike(f"%{search}%"))
        loans = await db.get_all(Loans, filters=filters, order_by=Loans.borrowed_at, order_desc=True, page=page, per_page=limit)
        return loans
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching loans: {e}") from e

async def get_loan_by_id(loan_id: str):
    try:
        loan = await db.get_by_id(Loans, loan_id)
        return loan
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching loan: {e}") from e

async def patch_loan(loan_id: str, payload: dict):
    try:
        loan = await db.get_by_id(Loans, loan_id)

        if loan.returned_at is not None:
            raise HTTPException(status_code=400, detail="Loan already returned")

        updated_loan = await db.update(Loans, loan_id, {
            "returned_at": datetime.now(),
            "notes": payload["notes"]
        })
        return updated_loan
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating loan: {e}") from e