// .js that handles the login page

document
  .getElementById("login_form")
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
