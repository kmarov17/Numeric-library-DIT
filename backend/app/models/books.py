from pydantic import BaseModel
from typing import List
from datetime import date


class Books(BaseModel):
    title: str
    author: str
    published_date: date
    isbn: str
    pages: int
    image: str
    categories: List[str]
    stock: int
    description: str

class BooksIn(Books):
    pass