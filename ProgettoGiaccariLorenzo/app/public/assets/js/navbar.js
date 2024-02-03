// .js that handles the behavior of the navbars in all pages (mainly, which of the two is shown in any given moment)

getUser().then((user) => {
  if (user.username) {
    //if the user has a username, ie, it's not empty, ie, it's logged
    // hide the non-logged navbar and show the logged one
    document.getElementById("navbar").style.display = "none";
    document.getElementById("navbar-logged").style.display = "";
    // Activate logout link
    document
      .getElementById("logout_link")
      .addEventListener("click", async (event) => {
        event.preventDefault();
        const response = await fetch(`/api/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          window.location.replace("/");
        } else {
          alert("Ops! Qualcosa è andato storto nel logout");
        }
      });
  }
});

// Gets from api the current user
async function getUser() {
  const response = await fetch(`/api/budget/whoami`);
  const user = await response.json();
  return user;
}
