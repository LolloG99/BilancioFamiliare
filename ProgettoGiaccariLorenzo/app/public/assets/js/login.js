// .js that handles the login page

const login_form = document.getElementById("login_form")

login_form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    if (!username || !password) {
      return; // If username or password are void, the function stops and lets bootstrap validation do its job
    }
    const response = await fetch(`/api/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    if (response.ok) {
      window.location.replace("/budget/whoami");
    } else {
      if (response.statusText === "wrong username or password") {
        alert("Username o password errati");
        return;
      }
      alert("Ops! Qualcosa è andato storto");
      return;
    }
  });

// Code from bootstrap docs for custom validation style and messages
// Apply custom Bootstrap validation styles to the form and prevent submission
login_form.addEventListener("submit", (event) => {
  if (!login_form.checkValidity()) {
    event.preventDefault();
    event.stopPropagation();
  }
  login_form.classList.add("was-validated");
});
