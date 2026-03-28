# pyre-ignore-all-errors
import os

def write_file(path, content):
    dir_name = os.path.dirname(path)
    if dir_name:
        os.makedirs(dir_name, exist_ok=True)
    with open(path, 'w') as f:
        f.write(content.strip() + '\n')

# 1. CORE
write_file("core/config.py", """
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost:5432/nova_db")
SECRET_KEY = os.getenv("SECRET_KEY", "your-super-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 # 1 week
""")

write_file("core/security.py", """
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt
from core.config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
""")

# 2. DB
write_file("db/base.py", """
from sqlalchemy.orm import declarative_base
Base = declarative_base()
""")

write_file("db/session.py", """
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from core.config import DATABASE_URL

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
""")

# 3. MODELS
write_file("models/__init__.py", "")

write_file("models/user.py", """
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from datetime import datetime
from db.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=True)
    password_hash = Column(String, nullable=True)
    
    is_guest = Column(Boolean, default=False)
    profile_image = Column(String, nullable=True)
    provider = Column(String, default="local")
    
    created_at = Column(DateTime, default=datetime.utcnow)
""")

write_file("models/chat.py", """
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from datetime import datetime
from db.base import Base

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"))
    receiver_id = Column(Integer, nullable=True) 
    room_id = Column(Integer, nullable=True)
    content = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    is_group = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
""")

write_file("models/review.py", """
from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from db.base import Base

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
""")

# 4. SCHEMAS
write_file("schemas/__init__.py", "")

write_file("schemas/user.py", """
from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: Optional[EmailStr] = None

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class LinkAccount(BaseModel):
    email: EmailStr
    password: str
""")

write_file("schemas/contact.py", """
from pydantic import BaseModel, EmailStr

class ReviewCreate(BaseModel):
    name: str
    email: EmailStr
    message: str

class ReviewOut(ReviewCreate):
    id: int

    class Config:
        from_attributes = True
""")

# 5. SERVICES
write_file("services/__init__.py", "")

write_file("services/auth_service.py", """
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
""")

# 6. API
write_file("api/__init__.py", "")

write_file("api/dependencies.py", """
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from db.session import SessionLocal
from core.config import SECRET_KEY, ALGORITHM
from models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login", auto_error=False)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = db.query(User).filter(User.id == int(user_id)).first()
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")
""")

write_file("api/routes/auth.py", """
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from schemas.user import UserCreate, UserLogin, UserResponse, Token, LinkAccount, UserUpdate
from api.dependencies import get_db, get_current_user
from services import auth_service
from models.user import User

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
""")

write_file("api/routes/contact.py", """
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from db.session import get_db  
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
""")

write_file("api/ws/manager.py", """
from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, WebSocket] = {}

    async def connect(self, ws: WebSocket, user_id: str):
        await ws.accept()
        self.active_connections[user_id] = ws

    def disconnect(self, user_id: str):
        if user_id in self.active_connections:
            del self.active_connections[user_id]

    async def send_personal_message(self, message: dict, user_id: str):
        if user_id in self.active_connections:
            ws = self.active_connections[user_id]
            await ws.send_json(message)

    async def broadcast(self, message: dict):
        for connection in self.active_connections.values():
            await connection.send_json(message)

manager = ConnectionManager()
""")

write_file("api/ws/chat_socket.py", """
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from jose import jwt, JWTError
from api.ws.manager import manager
from core.config import SECRET_KEY, ALGORITHM

router = APIRouter()

@router.websocket("/ws/chat/{token}")
async def websocket_endpoint(websocket: WebSocket, token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            await websocket.close(code=1008)
            return
    except JWTError:
        await websocket.close(code=1008)
        return

    await manager.connect(websocket, user_id)
    try:
        while True:
            data = await websocket.receive_json()
            receiver_id = data.get("receiver_id")
            room_id = data.get("room_id")
            content = data.get("content")

            message_payload = {
                "sender_id": user_id,
                "content": content,
                "room_id": room_id,
                "receiver_id": receiver_id
            }

            if receiver_id:
                await manager.send_personal_message(message_payload, str(receiver_id))
            else:
                await manager.broadcast(message_payload)

    except WebSocketDisconnect:
        manager.disconnect(user_id)
""")

# 7. MAIN
write_file("main.py", """
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db.session import engine
from db.base import Base

import models.user
import models.chat
import models.review

from api.routes.auth import router as auth_router
from api.routes.contact import router as contact_router
from api.ws.chat_socket import router as chat_socket_router

# Initialize Schema
Base.metadata.create_all(bind=engine)

app = FastAPI(title="NOVA Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(contact_router)
app.include_router(chat_socket_router)

@app.get("/")
def root():
    return {"status": "ok", "message": "NOVA Backend is running and secure!"}
""")

print("Successfully generated all enterprise backend files.")
