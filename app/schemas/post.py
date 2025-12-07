from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


# Shared properties
class PostBase(BaseModel):
    title: Optional[str] = Field(None, max_length=200)
    content: Optional[str] = None


# Properties to receive on creation
class PostCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    content: Optional[str] = None


# Properties to receive on update
class PostUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    content: Optional[str] = None


# Properties to return via API
class PostResponse(BaseModel):
    id: int
    title: str
    content: Optional[str]
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


# Properties with owner information
class PostWithOwner(PostResponse):
    owner_username: Optional[str] = None

    class Config:
        from_attributes = True
