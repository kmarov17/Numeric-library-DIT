from fastapi import HTTPException

from app.configs.tables import Books
from app.utils import db_utils as db


async def create_book(payload):
    try:
        payload['categories'] = ','.join(payload['categories'])
        new_book = await db.create(Books, payload)
        return new_book
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating book: {e}") from e

async def get_books(search: str, page: int, limit: int):
    try:
        filters = []
        if search:
            filters.append(Books.title.ilike(f"%{search}%") | Books.author.ilike(f"%{search}%") | Books.isbn.ilike(f"%{search}%"))
        books = await db.get_all(Books, filters=filters, order_by=Books.title, order_desc=False, page=page, per_page=limit)

        if len(books['items']) > 0:
            for book in books['items']:
                book.categories = book.categories.split(',') if book.categories else []

        return books
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching books: {e}") from e

async def get_book_by_id(book_id: str):
    try:
        book = await db.get_by_id(Books, book_id)
        book.categories = book.categories.split(',') if book.categories else []
        return book
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching book: {e}") from e

async def update_book(book_id: str, payload):
    try:
        payload['categories'] = ','.join(payload['categories'])
        updated_book = await db.update(Books, book_id, payload)
        if not updated_book:
            raise HTTPException(status_code=404, detail="Book not found")
        return updated_book
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating book: {e}") from e
    
async def delete_book(book_id: str):
    try:
        await db.delete(Books, book_id)
        return {"detail": "Book deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting book: {e}") from e