// .js file that handles modification, deletion and visualization of a single expense

const url = window.location.href;
const parts = url.split("/");
const id = parts[parts.length - 1];
const m = parts[parts.length - 2];
const y = parts[parts.length - 3];

// Shows the details of a single expense on a table
getExpense().then((expense) => {
  const table = document.querySelector("#expense_table");
  const tr = document.createElement("tr");
  const date = document.createElement("td");
  const description = document.createElement("td");
  const category = document.createElement("td");
  const total_cost = document.createElement("td");
  const users = document.createElement("td");
  date.innerText = expense.date.split("-")[2] + "-" + m + "-" + y;
  description.innerText = expense.description;
  category.innerText = expense.category;
  total_cost.innerText = expense.total_cost;
  users.innerText = "";
  Object.keys(expense.users).forEach((element) => {
    users.innerText += element + ": " + expense.users[element] + " ";
  });
  table.appendChild(tr);
  tr.appendChild(date);
  tr.appendChild(description);
  tr.appendChild(category);
  tr.appendChild(total_cost);
  tr.appendChild(users);
});

// Gets from api a specific expense using id
async function getExpense() {
  const response = await fetch(`/api/budget/${y}/${m}/${id}`);
  const expense = await response.json();
  return expense;
}

// Calls api's put
async function modifyExpense() {
  await fetch(`/api/budget/${y}/${m}/${id}`, { method: "PUT" });
}

// Calls api's delete
async function deleteExpense() {
  await fetch(`/api/budget/${y}/${m}/${id}`, { method: "DELETE" });
}
