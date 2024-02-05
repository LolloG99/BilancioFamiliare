// .js that handles the register process

const register_form = document.getElementById("register_form");

// Use api's signup POST
register_form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const name = document.getElementById("name").value.trim();
    const surname = document.getElementById("surname").value.trim();
    if (!username || !password || !name || !surname) {
      return; // If one of the fields is empty, the function stops and lets bootstrap validation do its job
    }
    const response = await fetch(`/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, name, surname }),
    });
    if (response.ok) {
      alert("Registrazione avvenuta con successo!");
      window.location.replace("/budget/whoami");
    } else {
      if (response.statusText === "username already taken") {
        alert("Username già presente, per favore sceglierne un altro");
        return;
      }
      alert("Ops! Qualcosa è andato storto");
      return;
    }
  });

// Code from bootstrap docs for custom validation style and messages
// Apply custom Bootstrap validation styles to the form and prevent submission
register_form.addEventListener("submit", (event) => {
  if (!register_form.checkValidity()) {
    event.preventDefault();
    event.stopPropagation();
  }
  register_form.classList.add("was-validated");
});