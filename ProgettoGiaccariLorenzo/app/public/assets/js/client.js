// Values that will be changed by the year and month dropdowns. These are used by getExpenses()
let month = "";
let year = "";

// Adds rows to the table-list of expenses, and adds years to the years dropdown menu
getExpenses().then((expenses) => {
  expenses.forEach((expense) => {
    addExpense(expense);
  });
});

let yearsSelector = document.getElementById("years");
let monthsSelector = document.getElementById("months")
// For loop that adds all years from 1900 to 2050 to 
for (let i = 1900; i < 2051; i++) {
    let new_year = document.createElement("option");
    new_year.value = i;
    new_year.innerText = i;
    yearsSelector.appendChild(new_year);
}

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

// Adds a row to the table-list of expenses
function addExpense(expense) {
  const table_body = document.getElementById("expenses_list_body");
  const tr = document.createElement("tr");
  const date = document.createElement("td");
  const description = document.createElement("td");
  const category = document.createElement("td");
  const total_cost = document.createElement("td");
  const a = document.createElement("a");
  const parts = expense.date.split("-");
  a.href = `/budget/${parts[0]}/${parts[1]}/${expense._id}`; //parts[0] is year, parts[1] is month, parts[2] is day
  a.innerText = `${parts[2]}-${parts[1]}-${parts[0]}`; //Mostra la data come giorno-mese-anno //expense.date;
  date.appendChild(a);
  description.innerText = expense.description;
  category.innerText = expense.category;
  total_cost.innerText = expense.total_cost;
  table_body.appendChild(tr);
  tr.appendChild(date);
  tr.appendChild(description);
  tr.appendChild(category);
  tr.appendChild(total_cost);
}

// Takes all expenses of a single users using api
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
