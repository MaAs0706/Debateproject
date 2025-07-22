#  StellarCompiler Debate Project — FastAPI AI Streaming Backend

A lightweight FastAPI backend that integrates with **[Ollama](https://ollama.com/)** to stream AI-generated responses in real time using **HTTPX** and **StreamingResponse**. Designed for low-latency interactions with real-time token streaming via **Server-Sent Events (SSE)**, making it perfect for modern web integrations like chat or debate platforms.

---

## 🔍 Project Structure

```
stellarcompiler-debateproject/
├── auth.html           # Login/Signup UI
├── dashboard.html      # Main user dashboard
├── hero.html           # Landing/hero section
├── main.py             # FastAPI backend with streaming logic
├── response.html       # AI response rendering page
└── styles.css          # Shared CSS for all HTML files
```

---

##  Key Features

-  **Real-Time AI Streaming**  
  Uses Server-Sent Events (SSE) to stream AI tokens as they're generated.

-  **Ollama Integration**  
  Works with locally running Ollama models for fast, private inference.

-  **CORS Enabled**  
  Fully CORS-enabled for seamless frontend-backend communication.

-  **Async HTTP with HTTPX**  
  Efficient async calls to the Ollama API with customizable timeout settings.

-  **Clean Modular Codebase**  
  Easy to expand or plug into existing projects.

---

##  Tech Stack

| Technology     | Usage                         |
|----------------|-------------------------------|
| **FastAPI**    | Web framework for backend      |
| **Uvicorn**    | ASGI server for FastAPI        |
| **HTTPX**      | Async HTTP client              |
| **Ollama**     | Local AI model runner          |
| **HTML5/CSS3** | Frontend templates + styling   |
| **JavaScript** | SSE client for live updates    |
| **Python 3.10+** | Backend logic & integration |

---

## 🌐 Deployment

This project is easily deployable on platforms like [Render.com](https://render.com/) or any service supporting Python + FastAPI.

### 🧪 Local Setup

1. Clone the repository  
   ```bash
   git clone https://github.com/your-username/stellarcompiler-debateproject
   cd stellarcompiler-debateproject
   ```

2. Install dependencies  
   ```bash
   pip install -r requirements.txt
   ```

3. Run locally with Uvicorn  
   ```bash
   uvicorn main:app --reload
   ```

4. Make sure your **Ollama model** is running locally and accessible.

---

##  Use Cases

- Live debate simulations  
- Real-time chat applications  
- AI-assisted writing or brainstorming  
- Classroom education tools with instant feedback  
