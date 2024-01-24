// .js file that handles the visualization of details of the balance between the current user and another user

// other_user is the username of the other user.
const url = window.location.href;
const parts = url.split("/");
const other_user = parts[parts.length - 1];
let current_user = ""; // username of the current user

document.getElementById("h2_title").innerText = "Dettagli bilancio tra te e " + other_user; 
getUser().then((user) => {
    current_user = user.username;
});

getBalanceId().then((balance) => {
  balance.forEach((expense) => {
    addBalanceRow(expense);
  });
});

function addBalanceRow(expense) {
  // Shows the details of a single expense on a table
  const table = document.getElementById("balance_table");
  const tr = document.createElement("tr");
  const date = document.createElement("td");
  const description = document.createElement("td");
  const details_link = document.createElement("td");
  const a = document.createElement("a");
  const parts = expense.date.split("-");
  date.innerText = `${parts[2]}-${parts[1]}-${parts[0]}`; //parts[0] is year, parts[1] is month, parts[2] is day
  if (expense.total_cost === "0") {
      // If the expense is a refund
      if (expense.users[current_user] > 0) {
        // If the refund is towards the other user (the other user received money)
        description.innerText = "Hai rimborsato a " + other_user + " " + expense.users[current_user] + "€";
    } else {
        // If the refund is towards the current user (the current user received money)
        description.innerText = other_user + " ti ha rimborsato di " + expense.users[other_user] + "€";
    }
  } else {
    // If the expense is a normal expense
    if (expense.host === current_user) {
        // If the current user is the host
        description.innerText = other_user + " ti deve " + expense.users[other_user] + "€";
    } else {
        // If the other user is the host (all retrieved expenses are hosted either by the current user or the other user)
        description.innerText = "Devi a " + other_user + " " + expense.users[current_user] + "€";
    }
  }
  a.href = `/budget/${parts[0]}/${parts[1]}/${expense._id}`;
  a.innerText = `Visualizza dettagli`;
  details_link.appendChild(a);
  table.appendChild(tr);
  tr.appendChild(date);
  tr.appendChild(description);
  tr.appendChild(details_link);
}

// Gets from api the expenses needed to visualize details of the balance between the current user and the other user
async function getBalanceId() {
  const response = await fetch(`/api/balance/${other_user}`);
  const balance = await response.json();
  return balance;
}

// Gets from api the current user
async function getUser() {
  const response = await fetch(`/api/budget/whoami`);
  const user = await response.json();
  return user;
}
