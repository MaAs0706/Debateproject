from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import ollama
from typing import Optional
#global memory
ai_side: str = None
Context_topic:str = None

app = FastAPI()

app.add_middleware(CORSMiddleware,
                   allow_origins=["*"],
                   allow_credentials=True,
                   allow_methods=["*"],
                   allow_headers=["*"],
                   )

#app.mount("/", StaticFiles(directory=".", html=True), name="static")

class DebateRequest(BaseModel):
    topic: str = None
    side: str = None
    userMsg: str = None

@app.post("/generate-roadmap")
async def generate_roadmap():
    prompt = "Create a 5-step roadmap to master debating for beginners."
    response = ollama.chat(model="gemma:2b", messages=[{"role": "user", "content": prompt}])
    roadmap = response['message']['content'].split('\n')
    roadmap = [step.strip("-• ") for step in roadmap if step.strip()]
    return {"roadmap": roadmap[:5]}

@app.post("/lightning-debate")
async def lightning_debate(req: DebateRequest):
    prompt = f"Present a 1-minute opening statement {req.side} the motion: '{req.topic}'"
    response = ollama.chat(model="gemma:2b", messages=[{"role": "user", "content": prompt}])
    return {"response": response['message']['content']}

@app.post("/duel-start")
async def duel_start(req: DebateRequest):
    Context_topic=req.topic
    ai_side= "against" if req.side =="for" else "for"
    prompt = f"1. Welcome the user to the debate session(under 20 words),2.Start a heated but logical debate about: {req.topic} take side: {ai_side}"
    response = ollama.chat(model="gemma:2b", messages=[{"role": "user", "content": prompt}])
    return {"statement": response['message']['content']}

@app.post("/duel-reply")
async def duel_reply(req: DebateRequest):
    prompt = f"Context:{Context_topic}, Direct Respond to the user's argument with a valid counterpoint under 5 points :\n\n{req.userMsg} take side{ai_side}"
    response = ollama.chat(model="gemma:2b", messages=[{"role": "user", "content": prompt}])
    return {"reply": response['message']['content']}
