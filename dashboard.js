document.querySelectorAll(".combat-mode-card").forEach(button => {
    button.addEventListener("click", () => {
        const modeLabel = button.querySelector("h3")?.innerText.trim().toLowerCase();

        let selectedMode = "classic";
        if (modeLabel?.includes("lightning")) selectedMode = "lightning";
        else if (modeLabel?.includes("campaign")) selectedMode = "campaign";
        else if (modeLabel?.includes("duel")) selectedMode = "duel";
        else if (modeLabel?.includes("tournament")) selectedMode = "tournament";

        // Optional: Store in sessionStorage if needed later
        sessionStorage.setItem("selectedMode", selectedMode);

        // Redirect with query param
        window.location.href = `response.html?mode=${selectedMode}`;
    });
});
