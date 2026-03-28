# pyre-ignore-all-errors
from sqlalchemy.orm import Session
from models.user import User
from core.security import hash_password, verify_password, create_access_token
import uuid

def create_user(db: Session, username: str, email: str, password: str):
    hashed = hash_password(password)
    user = User(
        username=username,
        email=email,
        password_hash=hashed
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def authenticate_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None
    if not verify_password(password, user.password_hash):
        return None
    return user

def login_user(db: Session, email: str, password: str):
    user = authenticate_user(db, email, password)
    if not user:
        return None
    token = create_access_token({"sub": str(user.id)})
    return token

def create_guest_user(db: Session):
    unique_suffix = uuid.uuid4().hex[:8]
    username = f"Guest_{unique_suffix}"
    
    user = User(
        username=username,
        is_guest=True,
        provider="guest"
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    token = create_access_token({"sub": str(user.id)})
    return token, user

def link_email_to_guest(db: Session, user: User, email: str, password: str):
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        return False, "Email already registered"
        
    user.email = email
    user.password_hash = hash_password(password)
    user.is_guest = False
    user.provider = "local"
    db.commit()
    db.refresh(user)
    return True, "Account successfully linked"
