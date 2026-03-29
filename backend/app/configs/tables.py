from sqlalchemy import Column, Integer, String, DateTime, func, Text, Boolean, ForeignKey, Date
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import declarative_base, relationship
import uuid

from .settings import DB_SCHEMA


Base = declarative_base()

class Users(Base):
    __tablename__ = "users"
    __table_args__ = {'schema': DB_SCHEMA}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    first_name = Column(String(255), nullable=True)
    last_name = Column(String(255), nullable=True)
    email = Column(String(255), nullable=True, unique=True)
    password = Column(String(255), nullable=False)
    type = Column(String(50), nullable=False)
    is_active = Column(Boolean, default=True)
    program = Column(String(50), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Books(Base):
    __tablename__ = "books"
    __table_args__ = {'schema': DB_SCHEMA}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    author = Column(String(255), nullable=False)
    published_date = Column(Date, nullable=True)
    isbn = Column(String(20), nullable=True)
    pages = Column(Integer, nullable=True)
    image = Column(String(255), nullable=True)
    categories = Column(String(255), nullable=True)
    stock = Column(Integer, nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Loans(Base):
    __tablename__ = "loans"
    __table_args__ = {'schema': DB_SCHEMA}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey(f"{DB_SCHEMA}.users.id"), nullable=False)
    book_id = Column(UUID(as_uuid=True), ForeignKey(f"{DB_SCHEMA}.books.id"), nullable=False)
    borrowed_at = Column(DateTime(timezone=True), server_default=func.now())
    due_date = Column(DateTime(timezone=True), nullable=True)
    returned_at = Column(DateTime(timezone=True), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
