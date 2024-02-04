// .js file that handles visualization of a single user, and of the user's give/take balance.
// There's also the option to search for users to take a look at their give/take balance with the current user.
// It also retrieves all the expenses of the current user.

// Value that will be changed by getUser; useful for search_user
let current_username = "";

// Values that will be changed by the year and month dropdowns. These are used by getExpenses()
let month = "";
let year = "";

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

// For loop that adds all years from 1900 to 2050 to 
const yearsSelector = document.getElementById("years");
const monthsSelector = document.getElementById("months");
for (let i = 1900; i < 2051; i++) {
    let new_year = document.createElement("option");
    new_year.value = i;
    new_year.innerText = i;
    yearsSelector.appendChild(new_year);
}

// Adding functionality to the year-month filter
const year_month_filter = document.getElementById("year_month_filter");
year_month_filter.addEventListener("submit", async (event) => {
  event.preventDefault();
  year = yearsSelector.value;
  month = monthsSelector.value;
  document.getElementById("expenses_list_body").innerHTML = "";
  getExpenses().then((expenses) => {
    expenses.forEach((expense) => {
      addExpense(expense);
    });
  });
});

// Adding functionality to the expenses' search form 
const expense_search = document.getElementById("expense_search");
expense_search.addEventListener("submit", async (event) => {
  event.preventDefault();
  year = "";
  month = "";
  yearsSelector.value = "";
  monthsSelector.value = "";
  document.getElementById("expenses_list_body").innerHTML = "";
  query = document.getElementById("expense_search_text").value;
  getExpensesQuery(query).then((expenses) => {
    expenses.forEach((expense) => {
      addExpense(expense);
    });
  });
})

// Adds rows to the table-list of expenses
getExpenses().then((expenses) => {
  expenses.forEach((expense) => {
    addExpense(expense);
  });
});

// Adds a row to the table-list of expenses
function addExpense(expense) {
  const table_body = document.getElementById("expenses_list_body");
  const tr = document.createElement("tr");
  const date = document.createElement("td");
  const description = document.createElement("td");
  const category = document.createElement("td");
  const total_cost = document.createElement("td");
  const host = document.createElement("td");
  const a = document.createElement("a");
  const parts = expense.date.split("-");
  a.href = `/budget/${parts[0]}/${parts[1]}/${expense._id}`; //parts[0] is year, parts[1] is month, parts[2] is day
  a.innerText = `${parts[2]}-${parts[1]}-${parts[0]}`; //Shows date as gg-mm-yyyy
  date.appendChild(a);
  description.innerText = expense.description;
  category.innerText = expense.category;
  total_cost.innerText = expense.total_cost;
  host.innerText = expense.host;
  table_body.appendChild(tr);
  tr.appendChild(date);
  tr.appendChild(description);
  tr.appendChild(category);
  tr.appendChild(total_cost);
  tr.appendChild(host);
}

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

// Gets user's balance from api
async function getBalance() {
  const response = await fetch(`/api/balance`);
  const balance = await response.json();
  return balance;
}

// Takes all expenses of the current user using api
async function getExpenses() {
  if (year != "") {
    if (month != "") {
      const response = await fetch(`/api/budget/${year}/${month}`);
      const expenses = await response.json();
      return expenses;
    } else {
      const response = await fetch(`/api/budget/${year}`);
      const expenses = await response.json();
      return expenses;
    }
  } else {
    const response = await fetch("/api/budget");
    const expenses = await response.json();
    return expenses;
  }
}

// Gets expenses from api with specified query
async function getExpensesQuery(query) {
  const response = await fetch(`/api/budget/search?q=${query}`);
  const expenses = await response.json();
  return expenses;
}
