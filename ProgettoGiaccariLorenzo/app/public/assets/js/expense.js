const url = window.location.href;
const parts = url.split("/");
const id = parts[parts.length - 1];
const m = parts[parts.length - 2];
const y = parts[parts.length - 3];

getExpense().then(expense => {
    console.log(expense);
    const table = document.querySelector("#expense_table");
    const tr = document.createElement("tr");
    const date = document.createElement("td");
    const description = document.createElement("td");
    const category = document.createElement("td");
    const total_cost = document.createElement("td");
    const users = document.createElement("td");
    date.innerText = expense.date;
    description.innerText = expense.description;
    category.innerText = expense.category;
    total_cost.innerText = expense.total_cost;
    users.innerText = "";
    Object.keys(expense.users).forEach(element => {
        users.innerText += element + ": " + expense.users[element] + " ";
    });
    table.appendChild(tr);
    tr.appendChild(date);
    tr.appendChild(description);
    tr.appendChild(category);
    tr.appendChild(total_cost);
    tr.appendChild(users);
})

async function getExpense() {
    const response = await fetch(`/api/budget/${y}/${m}/${id}`);
    const expense = await response.json();
    return expense;
}

async function modifyExpense() {
    await fetch(`/api/budget/${y}/${m}/${id}`, {method : 'PUT'});
}

async function deleteExpense() {
    await fetch(`/api/budget/${y}/${m}/${id}`, {method : 'DELETE'});
}