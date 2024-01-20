// Adds rows to the table-list of expenses
getExpenses().then(expenses => {
    expenses.forEach(expense => {
        addExpense(expense);
    });
});

// Adds a row to the table-list of expenses
function addExpense(expense) {
    const table = document.querySelector("#expenses_list");
    const tr = document.createElement("tr");
    const date = document.createElement("td");
    const description = document.createElement("td");
    const category = document.createElement("td");
    const total_cost = document.createElement("td");
    const a = document.createElement("a");
    const parts = expense.date.split("-");
    a.href = `/budget/${parts[0]}/${parts[1]}/${expense._id}`; //parts[0] is year, parts[1] is month, parts[2] is day
    a.innerText = `${parts[2]}-${parts[1]}-${parts[0]}`//Mostra la data come giorno-mese-anno //expense.date;
    date.appendChild(a);
    description.innerText = expense.description;
    category.innerText = expense.category;
    total_cost.innerText = expense.total_cost;
    table.appendChild(tr);
    tr.appendChild(date);
    tr.appendChild(description);
    tr.appendChild(category);
    tr.appendChild(total_cost);
}

// Takes all expenses of a single users using api
async function getExpenses() {
    const response = await fetch("/api/budget");
    const expenses = await response.json();
    return expenses;
}