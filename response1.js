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

function stripMarkdown(text) {
  return text
    .replace(/[*_`#>~\-]+/g, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .trim();
}

async function SubmitUserResponse(){
    const topicInput = document.getElementById("duelTopic").value.trim();
    const debateSide = document.getElementById("debateSide").value;
  const aiStatementDiv = document.getElementById("aiStatement");

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

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
     aiStatementDiv.innerText = `🧠 AI (${debateSide === "for" ? "Against" : "For"}): ${stripMarkdown(data.statement)}`;
  } catch (error) {
    console.error("Error starting duel:", error);
    aiStatementDiv.innerText = "❌ Failed to start debate. Try again later.";
  }
}
document.getElementById("aiStatement").innerHTML += `
  <p><span class="ai-prefix">AI:</span> <span class="ai-message">${aiText}</span></p>
  <p><span class="user-prefix">You:</span> <span class="user-message">${userText}</span></p>
`;