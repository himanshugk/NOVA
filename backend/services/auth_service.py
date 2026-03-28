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

def generate_reset_token(db: Session, email: str):
    user = db.query(User).filter(User.email == email, User.is_guest == False).first()
    if not user:
        return None
    from datetime import datetime, timedelta
    from jose import jwt
    from core.config import SECRET_KEY, ALGORITHM
    
    expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode = {"sub": str(user.id), "exp": expire, "type": "reset_password"}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def reset_password(db: Session, token: str, new_password: str):
    from jose import jwt, JWTError
    from core.config import SECRET_KEY, ALGORITHM
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        token_type = payload.get("type")
        if not user_id or token_type != "reset_password":
            return False, "Invalid token"
            
        user = db.query(User).filter(User.id == int(user_id)).first()
        if not user:
            return False, "User not found"
            
        user.password_hash = hash_password(new_password)
        db.commit()
        return True, "Password updated successfully"
    except JWTError:
        return False, "Invalid or expired token"
