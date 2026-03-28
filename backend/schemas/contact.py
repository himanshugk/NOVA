# pyre-ignore-all-errors
from pydantic import BaseModel, EmailStr

class ReviewCreate(BaseModel):
    name: str
    email: EmailStr
    message: str

class ReviewOut(ReviewCreate):
    id: int

    class Config:
        from_attributes = True
