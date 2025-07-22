document.querySelectorAll(".combat-mode-card").forEach(button => {
    button.addEventListener("click", () => {
        const modeLabel = button.querySelector("h3")?.innerText.trim().toLowerCase();

        let selectedMode = "classic";
        if (modeLabel?.includes("lightning")) selectedMode = "lightning_round";
        else if (modeLabel?.includes("campaign")) selectedMode = "campaign_mode";
        else if (modeLabel?.includes("duel")) selectedMode = "duel_arena";
        else if (modeLabel?.includes("tournament")) selectedMode = "tournament";

        // Store selected mode in session storage
        sessionStorage.setItem("selectedMode", selectedMode);

        // Redirect to the AI interface
        window.location.href = "response.html";
    });
});
