# pyre-ignore-all-errors
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import List
from pydantic import BaseModel

from db.session import get_db
from models.chat import Message, Contact
from models.user import User
from api.dependencies import get_current_user

router = APIRouter()

class AddContactRequest(BaseModel):
    username: str

@router.post("/add_contact")
def add_contact(payload: AddContactRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.is_guest:
        raise HTTPException(status_code=403, detail="Guests cannot add contacts")
        
    friend = db.query(User).filter(User.username == payload.username).first()
    if not friend:
        raise HTTPException(status_code=404, detail="Pilot not found")
        
    if friend.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot add yourself")
        
    existing = db.query(Contact).filter(Contact.user_id == current_user.id, Contact.friend_id == friend.id).first()
    if existing:
        return {"status": "already friends"}
        
    c1 = Contact(user_id=current_user.id, friend_id=friend.id)
    c2 = Contact(user_id=friend.id, friend_id=current_user.id)
    db.add(c1)
    db.add(c2)
    db.commit()
    
    return {"status": "success"}

@router.get("/contacts")
def get_contacts(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    contacts = db.query(Contact).filter(Contact.user_id == current_user.id).all()
    result = []
    for c in contacts:
        friend = db.query(User).filter(User.id == c.friend_id).first()
        if friend:
            result.append({"id": friend.id, "name": friend.username})
    return result

@router.get("/history/{contact_id}")
def get_history(contact_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if contact_id == 1: 
        messages = db.query(Message).filter(or_(Message.room_id == 1, Message.receiver_id == None)).order_by(Message.created_at.asc()).limit(150).all()
    else:
        messages = db.query(Message).filter(
            or_(
                and_(Message.sender_id == current_user.id, Message.receiver_id == contact_id),
                and_(Message.sender_id == contact_id, Message.receiver_id == current_user.id)
            )
        ).order_by(Message.created_at.asc()).limit(150).all()
        
    return messages
