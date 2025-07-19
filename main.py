from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware import Middleware
from pydantic import BaseModel
import httpx
from httpx import HTTPStatusError, ConnectTimeout, RequestError
import json
import asyncio


app = FastAPI()


@app.get("/generate/{prompt}")
async def ai_model(prompt: str):
    timeout_config = httpx.Timeout(
        60.0,  # total timeout
        connect=10.0,
        read=None,  # No read timeout in streaming
        write=10.0,
        pool=None
    )

    async def ai_stream():
        try:
            async with httpx.AsyncClient(timeout=timeout_config) as client:
                async with client.stream(
                    "POST",
                    "http://localhost:11434/api/generate",
                    json={
                        "model": "gemma:2b",
                        "prompt": prompt,
                        "stream": True
                    }
                ) as response:
                    response.raise_for_status()

                    async for line in response.aiter_lines():
                        if not line.strip():
                            continue
                        try:
                            json_chunk = json.loads(line)
                            if 'response' in json_chunk:
                                yield f"data: {json_chunk['response']}\n\n"
                        except json.JSONDecodeError as e:
                            yield f"data: [JSON parsing error: {str(e)}]\n\n"

        except ConnectTimeout:
            yield "data: [Error: Connection timed out to Ollama server]\n\n"
        except HTTPStatusError as e:
            yield f"data: [Ollama HTTP error: {e.response.text}]\n\n"
        except RequestError as e:
            yield f"data: [Error communicating with Ollama: {str(e)}]\n\n"
        except Exception as e:
            yield f"data: [Unhandled error: {str(e)}]\n\n"

    return StreamingResponse(ai_stream(), media_type="text/event-stream")
            

