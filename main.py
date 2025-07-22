from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import ollama  

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TopicInput(BaseModel):
    topic: str
    side: str = ""  # for lightning mode

@app.post("/generate_roadmap")
async def generate_roadmap():
    prompt = "Create a debate learning roadmap from beginner to pro with 4-5 checkpoints per level. Include descriptions and challenges."
    response = ollama.chat(model="llama3", messages=[{"role": "user", "content": prompt}])
    return {"roadmap": response["message"]["content"]}

@app.post("/lightning_intro")
async def lightning_intro(data: TopicInput):
    prompt = f"Give a strong opening statement FOR the motion: '{data.topic}'"
    if data.side == "for":
        prompt = f"Give a strong opening statement AGAINST the motion: '{data.topic}'"
    response = ollama.chat(model="llama3", messages=[{"role": "user", "content": prompt}])
    return {"opening": response["message"]["content"]}

@app.get("/duel_topic")
async def get_duel_topic():
    prompt = "Give me a random, debatable topic suitable for training debate skills."
    response = ollama.chat(model="llama3", messages=[{"role": "user", "content": prompt}])
    return {"topic": response["message"]["content"]}

@app.post("/duel_response")
async def duel_response(data: TopicInput):
    prompt = f"Respond to this user statement as a debater: '{data.topic}'"
    response = ollama.chat(model="llama3", messages=[{"role": "user", "content": prompt}])
    return {"aiResponse": response["message"]["content"]}
