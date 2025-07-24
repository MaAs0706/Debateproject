// Toggle between login and register
function toggleAuth(mode) {
  const loginBtn = document.getElementById("login-btn");
  const registerBtn = document.getElementById("register-btn");
  const emailGroup = document.getElementById("email-group");
  const title = document.getElementById("auth-title");
  const subtitle = document.getElementById("auth-subtitle");
  const footerText = document.getElementById("footer-text");
  const switchBtn = document.getElementById("auth-switch");
  const submitText = document.getElementById("submit-text");

  if (mode === 'register') {
    emailGroup.style.display = 'block';
    loginBtn.classList.remove('active');
    registerBtn.classList.add('active');
    title.textContent = "JOIN THE LADDER";
    subtitle.textContent = "Forge your identity";
    footerText.textContent = "Already enlisted?";
    switchBtn.textContent = "Return to gate";
    submitText.textContent = "JOIN COMBAT";
    switchBtn.onclick = () => toggleAuth('login');
  } else {
    emailGroup.style.display = 'none';
    loginBtn.classList.add('active');
    registerBtn.classList.remove('active');
    title.textContent = "ENTER ARENA";
    subtitle.textContent = "Return to battle";
    footerText.textContent = "New warrior?";
    switchBtn.textContent = "Join the ranks";
    submitText.textContent = "ENTER COMBAT";
    switchBtn.onclick = () => toggleAuth('register');
  }
}

// Handle form submission
function handleAuth(event) {
  event.preventDefault();

  // Get the form inputs
  const inputs = document.querySelectorAll('.shadow-fight-input');
  const username = inputs[0].value.trim();
  const email = inputs[1] ? inputs[1].value.trim() : '';
  const password = inputs[inputs.length - 1].value.trim();

  

  
  window.location.href = "dashboard.html";
}
