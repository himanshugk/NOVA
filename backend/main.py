# pyre-ignore-all-errors
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from api.ws.manager import live_tracker
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

@app.websocket("/ws/live")
async def live_users_endpoint(websocket: WebSocket):
    await live_tracker.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        live_tracker.disconnect(websocket)
        await live_tracker.broadcast()

@app.get("/")
def root():
    return {"status": "ok", "message": "NOVA Backend is running and secure!"}
