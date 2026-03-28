# pyre-ignore-all-errors
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from jose import jwt, JWTError
from api.ws.manager import manager
from core.config import SECRET_KEY, ALGORITHM
from db.session import SessionLocal
from models.chat import Message

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

            db = SessionLocal()
            try:
                msg_entry = Message(sender_id=user_id, content=content, room_id=room_id, receiver_id=receiver_id)
                db.add(msg_entry)
                db.commit()
            except BaseException:
                db.rollback()
            finally:
                db.close()

            if receiver_id:
                await manager.send_personal_message(message_payload, str(receiver_id))
                if str(receiver_id) != str(user_id):
                    await manager.send_personal_message(message_payload, str(user_id))
            else:
                await manager.broadcast(message_payload)

    except WebSocketDisconnect:
        manager.disconnect(user_id)
