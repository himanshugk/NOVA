# pyre-ignore-all-errors
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from models.review import Review
from schemas.contact import ReviewCreate, ReviewOut

# Wait, dependencies should be from api.dependencies
from api.dependencies import get_db

router = APIRouter(prefix="/contact", tags=["Contact"])

@router.post("/review", response_model=ReviewOut)
def submit_review(review: ReviewCreate, db: Session = Depends(get_db)):
    new_review = Review(
        name=review.name,
        email=review.email,
        message=review.message
    )
    db.add(new_review)
    db.commit()
    db.refresh(new_review)
    return new_review

@router.get("/reviews", response_model=List[ReviewOut])
def get_reviews(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    return db.query(Review).order_by(Review.created_at.desc()).offset(skip).limit(limit).all()
