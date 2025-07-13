from fastapi import FastAPI
from fastapi.middleware import Middleware
from pydantic import BaseModel
import httpx


app = FastAPI()


@app.get("/generate/{prompt}")
async def ai_model(prompt: str):
    timeout_config= httpx.Timeout(60.0, connect=10.0)

    async with httpx.AsyncClient(timeout=timeout_config) as client:
        response = await client.post(
            "http://localhost:11434/api/generate",
            json={
                "model":"gemma:2b",
                "prompt":prompt,
                "stream":False
            }

        )
    return {"response":response.json().get("response")}