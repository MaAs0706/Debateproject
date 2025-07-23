document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get("mode");

  const modeTitle = document.getElementById("mode-title");
  const classicSection = document.getElementById("classic-mode");
  const lightningSection = document.getElementById("lightning-round");
  const duelSection = document.getElementById("duel-arena");

  if (mode === "classic") {
    modeTitle.innerText = "Classic Mode";
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
  const roadmapDisplay = document.getElementById("roadmapDisplay");
  roadmapDisplay.innerHTML = "<p>Generating roadmap...</p>";

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3",
        prompt: "Give a detailed 5-step roadmap for preparing for a debate competition as a beginner."
      })
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    roadmapDisplay.innerHTML = '<div class="roadmap-container"></div>';
    const container = document.querySelector(".roadmap-container");

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split("\n").filter(Boolean);
      for (let line of lines) {
        try {
          const json = JSON.parse(line);
          if (json.response) {
            const cleanText = json.response.trim();
            const stepMatch = cleanText.match(/^\d+\. (.+)/);
            if (stepMatch) {
              const step = stepMatch[1];
              const stepElement = document.createElement("div");
              stepElement.classList.add("roadmap-step");
              stepElement.innerText = step;
              container.appendChild(stepElement);
            }
          }
        } catch (e) {
          console.error("Invalid JSON chunk:", line);
        }
      }
    }
  } catch (error) {
    roadmapDisplay.innerHTML = "<p>Error generating roadmap.</p>";
    console.error("Error:", error);
  }
}