"""
Burme AI - FastAPI Backend
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os

app = FastAPI(title="Burme AI API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model
class ChatRequest(BaseModel):
    prompt: str
    max_tokens: Optional[int] = 500
    temperature: Optional[float] = 0.7

# NVIDIA API
NVIDIA_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions"
NVIDIA_MODEL = "nvidia/llama-3.1-nemo-8b-instruct"

async def call_nvidia(prompt: str, max_tokens: int = 500, temperature: float = 0.7):
    import httpx
    api_key = os.environ.get("NVIDIA_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="NVIDIA_API_KEY not configured")
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            NVIDIA_API_URL,
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            },
            json={
                "model": NVIDIA_MODEL,
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": max_tokens,
                "temperature": temperature
            },
            timeout=30.0
        )
    
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail=response.text)
    
    data = response.json()
    return data["choices"][0]["message"]["content"]

@app.get("/")
async def root():
    return {"status": "OK", "message": "Burme AI API", "endpoint": "/v1/chat"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.post("/v1/chat")
async def chat(request: ChatRequest):
    try:
        reply = await call_nvidia(request.prompt, request.max_tokens, request.temperature)
        return {"success": True, "reply": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
