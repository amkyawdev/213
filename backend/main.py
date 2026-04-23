"""
Burme AI - Premium AI Web Application Backend
FastAPI with async streaming and multi-provider fallback
"""

import os
import json
import struct
import hashlib
import asyncio
from datetime import datetime, timedelta
from typing import Optional, AsyncGenerator, List, Dict
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Depends, status, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, EmailStr
from jose import JWTError, jwt
from passlib.context import CryptContext
import httpx

# Configuration
JWT_SECRET = os.getenv("JWT_SECRET", "burme-ai-secret-key-change-in-production")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Provider configuration - NVIDIA + Cerebras
AI_PROVIDERS = {
    "nvidia": {
        "url": "https://integrate.api.nvidia.ai/v1/chat/completions",
        "api_key_env": "NVIDIA_API_KEY",
        "model": "nvidia/llama-3.1-nemorus-70b-instruct",
        "priority": 1
    },
    "cerebras": {
        "url": "https://api.cerebras.cloud/v1/chat/completions",
        "api_key_env": "CEREBRAS_API_KEY",
        "model": "llama-3.3-70b",
        "priority": 2
    }
}

# Data paths
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
USER_LIST_PATH = os.path.join(DATA_DIR, "user-list.json")
DATABASE_PATH = os.path.join(DATA_DIR, "database.json")
CHAT_HISTORY_PATH = os.path.join(DATA_DIR, "chat-history.bin")

# Ensure data directory exists
os.makedirs(DATA_DIR, exist_ok=True)


def init_database():
    """Initialize database files if they don't exist"""
    if not os.path.exists(USER_LIST_PATH):
        with open(USER_LIST_PATH, "w") as f:
            json.dump([], f)
    
    if not os.path.exists(DATABASE_PATH):
        with open(DATABASE_PATH, "w") as f:
            json.dump({
                "app_state": "running",
                "api_status": {},
                "metrics": {
                    "total_requests": 0,
                    "active_users": 0,
                    "provider_stats": {}
                },
                "logs": []
            }, f, indent=2)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)


def decode_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except JWTError:
        return None


def load_users() -> List[dict]:
    try:
        with open(USER_LIST_PATH, "r") as f:
            return json.load(f)
    except (json.JSONDecodeError, FileNotFoundError):
        return []


def save_users(users: List[dict]):
    with open(USER_LIST_PATH, "w") as f:
        json.dump(users, f, indent=2)


def load_database() -> dict:
    try:
        with open(DATABASE_PATH, "r") as f:
            return json.load(f)
    except (json.JSONDecodeError, FileNotFoundError):
        return {"app_state": "running", "api_status": {}, "metrics": {}, "logs": []}


def save_database(db: dict):
    with open(DATABASE_PATH, "w") as f:
        json.dump(db, f, indent=2)


def log_activity(action: str, details: dict):
    """Log activity to database"""
    db = load_database()
    db["logs"].append({
        "timestamp": datetime.utcnow().isoformat(),
        "action": action,
        "details": details
    })
    # Keep only last 1000 logs
    db["logs"] = db["logs"][-1000:]
    save_database(db)


def save_chat_history(user_id: str, messages: List[dict]):
    """Save chat history in compressed binary format"""
    data = {
        "user_id": user_id,
        "messages": messages,
        "updated": datetime.utcnow().isoformat()
    }
    json_data = json.dumps(data).encode("utf-8")
    
    # Create a simple binary format with header
    header = b"BURME1"  # Magic number
    version = struct.pack("!H", 1)  # Version 1
    length = struct.pack("!I", len(json_data))
    
    with open(CHAT_HISTORY_PATH, "ab") as f:
        f.write(header + version + length + json_data)


def load_chat_history(user_id: str) -> List[dict]:
    """Load chat history from binary format"""
    messages = []
    if not os.path.exists(CHAT_HISTORY_PATH):
        return messages
    
    try:
        with open(CHAT_HISTORY_PATH, "rb") as f:
            while True:
                header = f.read(6)
                if not header:
                    break
                if header != b"BURME1":
                    break
                
                version = struct.unpack("!H", f.read(2))[0]
                length = struct.unpack("!I", f.read(4))[0]
                json_data = f.read(length)
                
                data = json.loads(json_data.decode("utf-8"))
                if data.get("user_id") == user_id:
                    messages = data.get("messages", [])
    except Exception:
        pass
    
    return messages


# Pydantic Models
class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class UserResponse(BaseModel):
    username: str
    email: str
    role: str


class ChatMessage(BaseModel):
    message: str
    session_id: Optional[str] = None


class ChatResponse(BaseModel):
    response: str
    provider: str
    model: str


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_database()
    log_activity("app_start", {"status": "Application started"})
    yield
    log_activity("app_stop", {"status": "Application stopped"})


app = FastAPI(
    title="Burme AI API",
    description="Premium AI Web Application Backend",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


async def stream_openai_format(client: httpx.AsyncClient, provider: str, model: str, messages: List[dict]) -> AsyncGenerator[str, None]:
    """Stream response in SSE format compatible with OpenAI API"""
    url = AI_PROVIDERS[provider]["url"]
    api_key = os.getenv(AI_PROVIDERS[provider]["api_key_env"])
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    # OpenRouter requires specific headers
    if provider == "openrouter":
        headers["HTTP-Referer"] = "https://burme-ai.com"
        headers["X-Title"] = "Burme AI"
    
    payload = {
        "model": model,
        "messages": messages,
        "stream": True
    }
    
    try:
        async with client.stream("POST", url, headers=headers, json=payload, timeout=60.0) as response:
            if response.status_code == 200:
                async for line in response.aiter_lines():
                    if line.startswith("data: "):
                        data = line[6:]
                        if data == "[DONE]":
                            break
                        try:
                            parsed = json.loads(data)
                            if "choices" in parsed and len(parsed["choices"]) > 0:
                                delta = parsed["choices"][0].get("delta", {})
                                content = delta.get("content", "")
                                if content:
                                    yield f"data: {json.dumps({'content': content, 'provider': provider})}\n\n"
                        except json.JSONDecodeError:
                            continue
            elif response.status_code == 429:
                raise httpx.HTTPStatusError("Rate limited", request=response.request, response=response)
            else:
                raise httpx.HTTPStatusError(f"HTTP {response.status_code}", request=response.request, response=response)
    except Exception as e:
        raise e


class SmartProviderRouter:
    """Cerebras Provider Router - Single Provider"""
    
    def __init__(self):
        self.provider = "nvidia"
    
    async def get_response_stream(
        self, 
        messages: List[dict], 
        preferred_provider: Optional[str] = None
    ) -> AsyncGenerator[str, None]:
        """Get streaming response from Cerebras"""
        
        try:
            config = AI_PROVIDERS[self.provider]
            model = config["model"]
            
            async with httpx.AsyncClient(timeout=60.0) as client:
                async for chunk in stream_openai_format(client, self.provider, model, messages):
                    yield chunk
            return  # Success, exit
            
        except Exception as e:
            error_msg = f"Cerebras API error: {str(e)}"
            yield f"data: {json.dumps({'error': error_msg, 'provider': 'cerebras'})}\n\n"


router_instance = SmartProviderRouter()


# API Routes

@app.get("/")
async def root():
    return {"message": "Burme AI API", "version": "1.0.0", "status": "running"}


@app.get("/health")
async def health_check():
    db = load_database()
    return {
        "status": "healthy",
        "app_state": db.get("app_state", "running"),
        "available_providers": [p for p in AI_PROVIDERS.keys() if os.getenv(AI_PROVIDERS[p]["api_key_env"])]
    }


# Auth Routes
@app.post("/api/auth/register", response_model=Token)
async def register(user: UserRegister):
    users = load_users()
    
    # Check if user exists
    if any(u["username"] == user.username for u in users):
        raise HTTPException(status_code=400, detail="Username already exists")
    
    if any(u["email"] == user.email for u in users):
        raise HTTPException(status_code=400, detail="Email already exists")
    
    # Create new user
    new_user = {
        "username": user.username,
        "email": user.email,
        "password_hash": get_password_hash(user.password),
        "role": "user",
        "created_at": datetime.utcnow().isoformat()
    }
    
    users.append(new_user)
    save_users(users)
    
    # Generate token
    access_token = create_access_token({"sub": user.username, "role": new_user["role"]})
    
    log_activity("user_register", {"username": user.username})
    
    return {"access_token": access_token, "token_type": "bearer"}


@app.post("/api/auth/login", response_model=Token)
async def login(user: UserLogin):
    users = load_users()
    
    # Find user
    db_user = None
    for u in users:
        if u["username"] == user.username:
            db_user = u
            break
    
    if not db_user or not verify_password(user.password, db_user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Generate token
    access_token = create_access_token({"sub": user.username, "role": db_user["role"]})
    
    log_activity("user_login", {"username": user.username})
    
    return {"access_token": access_token, "token_type": "bearer"}


def get_current_user(authorization: str = None):
    """Extract and validate user from Authorization header"""
    if not authorization or not authorization.startswith("Bearer "):
        return None
    
    token = authorization[7:]
    payload = decode_token(token)
    if not payload:
        return None
    
    return {"username": payload.get("sub"), "role": payload.get("role")}


@app.get("/api/user/me", response_model=UserResponse)
async def get_me(authorization: str = None):
    user = get_current_user(authorization)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    users = load_users()
    for u in users:
        if u["username"] == user["username"]:
            return UserResponse(
                username=u["username"],
                email=u["email"],
                role=u["role"]
            )
    
    raise HTTPException(status_code=404, detail="User not found")


# Chat Routes
@app.post("/api/chat/stream")
async def chat_stream(message: ChatMessage, authorization: str = None):
    """Streaming chat endpoint with smart provider routing"""
    current_user = get_current_user(authorization)
    
    # Load chat history
    user_id = current_user["username"] if current_user else "anonymous"
    history = load_chat_history(user_id)
    
    # Add user message
    messages = [{"role": "user", "content": message.message}]
    
    # Include history (last 10 messages)
    for msg in history[-10:]:
        messages.insert(0, {"role": msg["role"], "content": msg["content"]})
    
    # Get streaming response
    async def generate():
        async for chunk in router_instance.get_response_stream(messages):
            yield chunk
    
    return StreamingResponse(generate(), media_type="text/event-stream")


@app.websocket("/ws/chat")
async def chat_websocket(websocket: WebSocket):
    """WebSocket chat endpoint for real-time streaming"""
    await websocket.accept()
    
    try:
        while True:
            data = await websocket.receive_json()
            message = data.get("message", "")
            session_id = data.get("session_id")
            
            if not message:
                continue
            
            # Load history
            history = load_chat_history("websocket_user")
            messages = [{"role": "user", "content": message}]
            
            for msg in history[-10:]:
                messages.insert(0, {"role": msg["role"], "content": msg["content"]})
            
            # Stream response
            await websocket.send_json({"type": "start", "provider": "cerebras"})
            
            async for chunk in router_instance.get_response_stream(messages):
                if chunk.startswith("data: "):
                    try:
                        parsed = json.loads(chunk[6:])
                        if "content" in parsed:
                            await websocket.send_json({
                                "type": "content",
                                "content": parsed["content"],
                                "provider": parsed.get("provider", "unknown")
                            })
                        elif "error" in parsed:
                            await websocket.send_json({
                                "type": "error",
                                "error": parsed["error"]
                            })
                    except json.JSONDecodeError:
                        continue
            
            await websocket.send_json({"type": "end"})
            
    except WebSocketDisconnect:
        pass


# Dashboard Routes
@app.get("/api/dashboard/stats")
async def get_dashboard_stats(authorization: str = None):
    """Get dashboard statistics"""
    user = get_current_user(authorization)
    
    # For now, allow any authenticated user
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    db = load_database()
    users = load_users()
    
    return {
        "total_users": len(users),
        "active_users": db["metrics"].get("active_users", 0),
        "total_requests": db["metrics"].get("total_requests", 0),
        "provider_stats": db["metrics"].get("provider_stats", {}),
        "recent_logs": db["logs"][-20:]
    }


@app.get("/api/dashboard/users")
async def get_users(authorization: str = None):
    """Get all users (admin only)"""
    user = get_current_user(authorization)
    
    if not user or user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    users = load_users()
    return [
        {"username": u["username"], "email": u["email"], "role": u["role"], "created_at": u["created_at"]}
        for u in users
    ]


@app.get("/api/dashboard/logs")
async def get_logs(authorization: str = None, limit: int = 50):
    """Get activity logs"""
    user = get_current_user(authorization)
    
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    db = load_database()
    return db["logs"][-limit:]


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)