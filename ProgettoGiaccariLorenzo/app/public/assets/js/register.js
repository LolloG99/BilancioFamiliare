// .js that handles the register process

document
  .getElementById("register_form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = document.getElementById("username").value.trim();
    if (!username) {
      alert("Per favore, inserire uno username");
      return;
    }
    const password = document.getElementById("password").value.trim();
    if (!password) {
      alert("Per favore, inserire una password");
      return;
    }
    const name = document.getElementById("name").value.trim();
    if (!name) {
      alert("Per favore, inserire un nome");
      return;
    }
    const surname = document.getElementById("surname").value.trim();
    if (!surname) {
      alert("Per favore, inserire un cognome");
      return;
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
