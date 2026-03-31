# 🎮 NOVA - 3D Gaming Platform with Real-Time Chat

## 🌐 Live Demo

* 🎮 Frontend: https://nova-site-eosin.vercel.app/
* ⚙️ Backend: https://nova-jetp.onrender.com
* 📡 API Docs: https://nova-jetp.onrender.com/docs

> ⚠️ Note: Backend is hosted on Render free tier and may take a few seconds to start.

---

## 📌 Overview

NOVA is a full-stack 3D gaming web platform that allows users to play games either as guests or authenticated users. The platform enforces feature-based access control and includes a real-time chat system for registered users.

---

## 🧠 Core Features

### 🎮 Gaming System

* 3D interactive gameplay
* Guest access without login

### 🔐 Authentication System

* Guest mode support
* User registration & login
* OAuth-ready (extendable)

### 💬 Real-Time Chat

* WebSocket-based messaging
* Room-based communication
* Available only for authenticated users

### 🤝 Social Features

* Add contacts (friends)
* User interaction layer

### 📝 Feedback System

* Submit reviews
* Report issues or complaints

---

## 🛠️ Tech Stack

### Backend

* FastAPI
* SQLAlchemy
* SQLite
* Uvicorn

### Frontend

* React (Vite)
* TypeScript
* Tailwind CSS

---

## 📁 Project Structure

```
NOVA/
├── backend/
│   ├── api/
│   ├── core/
│   ├── db/
│   ├── models/
│   ├── schemas/
│   ├── services/
│   ├── main.py
│   └── nova_dev.db
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── vite.config.ts
│
└── README.md
```

---

## ⚙️ Local Setup

### 1. Clone Repository

```
git clone <your-repo-link>
cd NOVA
```

---

### 2. Backend Setup

```
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend: http://127.0.0.1:8000

---

### 3. Frontend Setup

```
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173

---

## 🔗 System Architecture

```
User (Browser)
     ↓
Frontend (Vercel - React)
     ↓
Backend (Render - FastAPI)
     ↓
Database (SQLite)
```

---

## 🗄️ Database Schema

Core tables:

* users → authentication & identity
* messages → chat system
* rooms → chat grouping
* contacts → user relationships
* reviews → feedback system

---

## 🔒 Access Control

| Feature     | Guest User | Logged-in User |
| ----------- | ---------- | -------------- |
| Play Games  | ✅          | ✅              |
| Chat System | ❌          | ✅              |
| Contacts    | ❌          | ✅              |
| Reviews     | ✅          | ✅              |

---

## 🚀 Deployment

### Frontend

* Hosted on Vercel

### Backend

* Hosted on Render
* FastAPI server with REST + WebSocket support

### Integration

* REST API communication
* WebSocket for real-time chat
* CORS configured for cross-origin requests

---

## ⚠️ Limitations

* SQLite used (not ideal for production)
* Backend cold starts due to free hosting
* Limited scalability in current architecture

---

## 🔮 Future Improvements

* PostgreSQL migration
* Chat encryption
* Notification system
* Leaderboard & ranking
* Docker + CI/CD pipeline

---

## 👨‍💻 Author

Himanshu Gurjar
