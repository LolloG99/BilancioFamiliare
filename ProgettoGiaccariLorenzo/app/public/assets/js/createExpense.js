// .js file that handles creation of a single expense in createExpense.html

const form = document.getElementById("create_expense_form");
let current_username = "";
// Array with all usernames to check wether a user that is part of the new expense being created exists in the users database
let all_usernames = [];

getUsersQuery("").then((users) => {
  userlist = document.getElementById("userlist");
  users.forEach((user) => {
    all_usernames.push(user.username);
    op = document.createElement("option");
    op.value = user.username;
    op.innerText = user.name + " " + user.surname;
    userlist.appendChild(op);
  });
});

// sets current_username and user_info_1's name field's value both to the current user's username
getUser().then((user) => {
  current_username = user.username;
  //document.getElementById("user_info_1").getElementsByClassNames("user_info_element")[1].setAttribute("value", current_username);
  user_info_1.querySelectorAll(`.user_info_element`)[1].setAttribute("value", current_username);

});

// At submit, takes data and fetches api
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const date = document.getElementById("date").value.trim();
  const description = document.getElementById("description").value.trim();
  const category = document.getElementById("category").value.trim();
  const total_cost = document.getElementById("total_cost").value.trim();
  if (!date) {
    alert("Per favore, inserire una data");
    return;
  }

  // Creates users and makes sure the sum of all parts is equal to total_cost
  let users = {};
  let sum = 0;
  const users_html = document.getElementById("users");
  for (let i = 0; i < users_html.children.length; i++) {
    const username = document.getElementById("user" + (i + 1)).value.trim();
    const userpart = document.getElementById("part" + (i + 1)).value;
    if (username && userpart) {
      if (!all_usernames.includes(username)) {
        alert("Utente " + username + " non esiste!");
        return;
      }
      sum += parseFloat(userpart);
      users[username] = userpart;
    }
  }

  // If the current user is not added in the form, it is automatically added with part = 0.
  // This is for situations in which, for example, the current user anticipated money for another user.
  if (!Object.hasOwn(users, current_username)) {
    users[current_username] = 0;
  }
  // If the expense is a refund, there needs to be exactly two users.
  if (parseFloat(total_cost) === 0 && Object.keys(users).length !== 2) {
    alert(
      "Attenzione! In un rimborso, devono esserci solo 2 utenti coinvolti, di cui uno devi essere tu!"
    );
    return;
  }
  if (sum !== parseFloat(total_cost)) {
    alert(
      "Attenzione! Il costo totale della spesa dev'essere uguale alla somma delle parti di spesa degli utenti!"
    );
    return;
  }

  const parts = date.split("-");
  const year = parts[0];
  const month = parts[1];
  // Calls api to create a new expense with chosen values
  const response = await fetch(`/api/budget/${year}/${month}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ date, description, category, total_cost, users }),
  });
  if (!response.ok) {
    alert("Qualcosa è andato storto! Spesa non aggiunta :(");
    return;
  } else {
    alert("Spesa aggiunta con successo! :)");
    return;
  }
});

// Gets from api the current user
async function getUser() {
  const response = await fetch(`/api/budget/whoami`);
  const user = await response.json();
  return user;
}

// Gets users from api with specified query
async function getUsersQuery(query) {
  const response = await fetch(`/api/users/search?q=${query}`);
  const users = await response.json();
  return users;
}
