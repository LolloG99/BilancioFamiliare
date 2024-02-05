
// If the users database is empty, the demo button is displayed.
getDemoFlag().then((flag) => {
    if (flag) {
        document.getElementById("demo").style.display = "";
        document.getElementById("demo_button").addEventListener("click", (event) => {
        event.preventDefault();
        initiateDemo().then();
      });
    }
})

// Calls api post to add the demo data to the databases.
async function initiateDemo() {
  const response = await fetch(`/api/initiate_demo`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.ok) {
    alert("Demo inizializzata con successo!");
    window.location.reload();
  } else {
    alert("Ops! Qualcosa è andato storto");
    return;
  }
}

// Gets from api wether the users database is empty or not.
async function getDemoFlag() {
    const response = await fetch("/api/demo_flag");
    const flag = await response.json();
    return flag;
}