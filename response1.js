document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get("mode");

  const modeTitle = document.getElementById("mode-title");
  const classicSection = document.getElementById("classic-mode");
  const lightningSection = document.getElementById("lightning-round");
  const duelSection = document.getElementById("duel-arena");

  if (mode === "campaign") {
    modeTitle.innerText = "campaign Mode";
    classicSection.classList.remove("hidden");
  } else if (mode === "lightning") {
    modeTitle.innerText = "Lightning Round";
    lightningSection.classList.remove("hidden");
  } else if (mode === "duel") {
    modeTitle.innerText = "Duel Arena";
    duelSection.classList.remove("hidden");
  }
});

// ---------- Classic Mode: Generate Roadmap ----------
async function generateRoadmap() {
    document.getElementById('Generatebutton').style.visibility='hidden';
  const roadmapDisplay = document.getElementById("roadmapDisplay");
  roadmapDisplay.innerHTML = "<p>Generating roadmap...</p>";

  try {
    const response = await fetch("http://localhost:8000/generate-roadmap", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({})
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const roadmapSteps = data.roadmap;

    roadmapDisplay.innerHTML = "<h3>Debate Preparation Roadmap:</h3>";

    roadmapSteps.forEach((stepText, index) => {
      const stepElement = document.createElement("p");
      stepElement.innerText = `${index + 1}. ${stripMarkdown(stepText)}`;
      roadmapDisplay.appendChild(stepElement);
    });

  } catch (error) {
    console.error("Error generating roadmap:", error);
    roadmapDisplay.innerHTML = "<p>Error generating roadmap. Please try again later.</p>";
  }
}

//------------Duel Start Operation--------------
async function SubmitUserResponse() {
  const topicInput = document.getElementById("topicInput").value.trim();
  const debateSide = document.getElementById("debateSide").value;
  const aiStatementDiv = document.getElementById("aiStatement");
  const chatBox = document.getElementById("chatBox");
  const chatLog = document.getElementById("chatLog");
  console.log(document.getElementById("duel-arena"));


  if (!topicInput) {
    aiStatementDiv.innerText = "⚠️ Please enter a topic to start the debate.";
    return;
  }

  try {
    aiStatementDiv.innerText = "🔄 Starting debate...";
    const response = await fetch("http://localhost:8000/duel-start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        topic: topicInput,
        side: debateSide
      })
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    const initialAIReply = stripMarkdown(data.statement);


    aiStatementDiv.innerHTML = `🧠 AI (${debateSide === "for" ? "Against" : "For"}): ${initialAIReply}`;
    document.getElementById("duel-arena").classList.add("hidden");
    chatBox.classList.remove("hidden");
    chatLog.innerHTML = `<div><strong>AI:</strong> ${initialAIReply}</div>`;
  } catch (error) {
    console.error("Error starting duel:", error);
    aiStatementDiv.innerText = "❌ Failed to start debate. Try again later.";
  }
}

//---------------Duel Reply Operation----------------
async function sendUserReply() {
  const userMsg = document.getElementById("userMessageInput").value.trim();
  const chatLog = document.getElementById("chatLog");

  if (!userMsg) return;

  // Append user message
  chatLog.innerHTML += `<div><strong>You:</strong> ${userMsg}</div>`;
  document.getElementById("userMessageInput").value = "";

  // 🧠 Show AI is thinking...
  const thinkingId = `thinking-${Date.now()}`;
  chatLog.innerHTML += `<div id="${thinkingId}"><em>🧠 AI is thinking...</em></div>`;
  chatLog.scrollTop = chatLog.scrollHeight;

  try {
    const response = await fetch("http://localhost:8000/duel-reply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
            topic: "",
            side: "", 
            userMsg: userMsg 
        })
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    const aiReply = stripMarkdown(data.reply);

    // Replace "thinking" with actual AI response
    const thinkingElement = document.getElementById(thinkingId);
    if (thinkingElement) {
      thinkingElement.innerHTML = `<strong>AI:</strong> ${aiReply}`;
    } else {
      chatLog.innerHTML += `<div><strong>AI:</strong> ${aiReply}</div>`;
    }

    chatLog.scrollTop = chatLog.scrollHeight;
  } catch (error) {
    console.error("Error replying to duel:", error);

    // Replace or add error message
    const thinkingElement = document.getElementById(thinkingId);
    if (thinkingElement) {
      thinkingElement.innerHTML = `<strong>System:</strong> ❌ Failed to respond. Try again later.`;
    } else {
      chatLog.innerHTML += `<div><strong>System:</strong> ❌ Failed to respond. Try again later.</div>`;
    }
  }
}

function stripMarkdown(text) {
  return text
    .replace(/[*_~`#>]/g, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/!\[(.*?)\]\(.*?\)/g, "")
    .replace(/-{3,}/g, "")         
    .trim();
}