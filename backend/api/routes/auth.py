# pyre-ignore-all-errors
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from schemas.user import UserCreate, UserLogin, UserResponse, Token, LinkAccount, UserUpdate
from api.dependencies import get_db, get_current_user
from core.security import create_access_token
from services import auth_service
from models.user import User
import requests
from pydantic import BaseModel

class SocialLogin(BaseModel):
    provider: str
    access_token: str

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    return auth_service.create_user(db, user.username, user.email, user.password)

@router.post("/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):
    token = auth_service.login_user(db, user.email, user.password)
    if not token:
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    return {"access_token": token, "token_type": "bearer"}

@router.post("/guest", response_model=Token)
def guest_login(db: Session = Depends(get_db)):
    token, _ = auth_service.create_guest_user(db)
    return {"access_token": token, "token_type": "bearer"}

@router.post("/social", response_model=Token)
def social_login(data: SocialLogin, db: Session = Depends(get_db)):
    if data.provider.lower() == 'google':
        verify_url = f"https://www.googleapis.com/oauth2/v3/userinfo?access_token={data.access_token}"
        try:
            r = requests.get(verify_url)
            r.raise_for_status()
            user_info = r.json()
        except BaseException:
            raise HTTPException(status_code=400, detail="Invalid Google token")
            
        email = user_info.get("email")
        name = user_info.get("name")
        picture = user_info.get("picture")
        
        if not email:
            raise HTTPException(status_code=400, detail="Email not provided by Google")
            
        user = db.query(User).filter(User.email == email).first()
        if not user:
            user = User(
                username=name or "Google_Pilot",
                email=email,
                provider="google",
                profile_image=picture,
                is_guest=False
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            
        token = create_access_token({"sub": str(user.id)})
        return {"access_token": token, "token_type": "bearer"}
    else:
        raise HTTPException(status_code=400, detail="Provider not supported yet")

@router.post("/link")
def link_account(
    data: LinkAccount, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_guest:
        raise HTTPException(status_code=400, detail="Account is already fully registered")
        
    success, message = auth_service.link_email_to_guest(db, current_user, data.email, data.password)
    if not success:
        raise HTTPException(status_code=400, detail=message)
    return {"message": message}

@router.get("/me", response_model=UserResponse)
def read_user_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=UserResponse)
def update_user_me(
    data: UserUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if data.username:
        current_user.username = data.username
    if data.email and not current_user.is_guest:
        current_user.email = data.email
    db.commit()
    db.refresh(current_user)
    return current_user

@router.delete("/me")
def delete_user_me(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    db.delete(current_user)
    db.commit()
    return {"message": "User successfully deleted"}
