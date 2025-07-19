from fastapi import FastAPI, HTTPException
from fastapi.middleware import Middleware
from pydantic import BaseModel
import httpx
from httpx import HTTPStatusError, ConnectTimeout, RequestError


app = FastAPI()


@app.get("/generate/{prompt}")
async def ai_model(prompt: str):
    timeout_config= httpx.Timeout(60.0, 
        connect=10.0,
        read=1000.0,
        write=10.0,
        pool=None
        )

    async with httpx.AsyncClient(timeout=timeout_config) as client:
        response = await client.post(
            "http://localhost:11434/api/generate",
            json={
                "model":"gemma:2b",
                "prompt":prompt,
                "stream":False
            }

        )
    response.raise_for_status()

    try:
        json_data=response.json()
        if "response" not in json_data:
            raise HTTPException(status_code=502, detail="Missing 'response' field from Ollama.")
        return {"response": json_data["response"]}
        
    except ValueError:
            raise HTTPException(status_code=500, detail="Invalid JSON format returned by Ollama.")

    except ConnectTimeout:
        raise HTTPException(status_code=504, detail="Connection timed out to Ollama server.")
    
    except HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=f"Ollama error: {e.response.text}")
    
    except RequestError as e:
        raise HTTPException(status_code=502, detail=f"Error communicating with Ollama: {str(e)}")
    
    except Exception as e:
        # Catch-all fallback
        raise HTTPException(status_code=500, detail=f"Unhandled error: {str(e)}")
            

