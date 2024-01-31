// .js file that handles visualization of a single user, and of the user's give/take balance.
// There's also the option to search for users to take a look at their give/take balance with the current user.

let current_username = "";

// Shows the details of the current user on a table
getUser().then((user) => {
  const table = document.getElementById("user_table_body");
  const tr = document.createElement("tr");
  const username = document.createElement("td");
  const name = document.createElement("td");
  const surname = document.createElement("td");
  current_username = user.username;
  username.innerText = user.username;
  name.innerText = user.name;
  surname.innerText = user.surname;
  table.appendChild(tr);
  tr.appendChild(username);
  tr.appendChild(name);
  tr.appendChild(surname);
});

// Shows the give/take balance of the current user, in a table where
// each row tells how much does the current user owes/is owed from another user
getBalance().then((balance) => {
  const table_body = document.getElementById("balance_table_body");
  Object.keys(balance).forEach((user) => {
    const tr = document.createElement("tr");
    const username = document.createElement("td");
    const debt = document.createElement("td");
    const a = document.createElement("a");
    a.href = `/balance/${user}`;
    a.innerText = user;
    debt.innerText = balance[user];
    username.appendChild(a);
    table_body.appendChild(tr);
    tr.appendChild(username);
    tr.appendChild(debt);
  });
});

// Searching users with the user_search form
// The search results will be displayed on a table with username, name and surname
// you can click the username to see the give/take balance details between that user and the current user
const user_search = document.getElementById("user_search");
user_search.addEventListener("submit", async (event) => {
  event.preventDefault();
  const query = document.getElementById("user_search_text").value;
  getUsersQuery(query).then((users) => {
    document.getElementById("user_search_table").style.display = "";
    const table_body = document.getElementById("user_search_table_body");
    table_body.innerHTML = "";
    users.forEach((user) => {
      const tr = document.createElement("tr");
      const username = document.createElement("td");
      const name = document.createElement("td");
      const surname = document.createElement("td");
      if (current_username !== user.username) {
        const a = document.createElement("a");
        a.href = `/balance/${user.username}`;
        a.innerText = user.username;
        username.appendChild(a);
      } else {
        username.innerText = user.username;
      }
      name.innerText = user.name;
      surname.innerText = user.surname;
      table_body.appendChild(tr);
      tr.appendChild(username);
      tr.appendChild(name);
      tr.appendChild(surname);
    });
  });
});

// Gets from api the current user
async function getUser() {
  const response = await fetch(`/api/budget/whoami`);
  const user = await response.json();
  return user;
}

// Gets user's balance from api
async function getBalance() {
  const response = await fetch(`/api/balance`);
  const balance = await response.json();
  return balance;
}

// Gets users from api with specified query
async function getUsersQuery(query) {
  const response = await fetch(`/api/users/search?q=${query}`);
  const users = await response.json();
  return users;
}
