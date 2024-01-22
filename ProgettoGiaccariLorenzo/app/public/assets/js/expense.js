// .js file that handles modification, deletion and visualization of a single expense

// y and m are used for get and delete; id for get, delete and put.
const url = window.location.href;
const parts = url.split("/");
const id = parts[parts.length - 1];
const m = parts[parts.length - 2];
const y = parts[parts.length - 3];

// Function that creates a user_info in the modify_expense_form and connects itself to the click event of the next (if clonable is true.)
function new_user_info(i, user, part, clonable) {
  const user_info_id = "user_info_" + (i-1);
  let el = document.getElementById(user_info_id);
  let clone = el.cloneNode(true);
  clone.id = 'user_info_' + i;
  clone.children[0].htmlFor = "user" + i; // Label user
  clone.children[1].id = "user" + i; // Textinput user
  clone.children[1].name = "user" + i;
  clone.children[1].setAttribute("value", user);
  clone.children[1].value = user;
  clone.children[2].htmlFor = "part" + i; // Label part
  clone.children[3].id = "part" + i; // Numberinput part
  clone.children[3].name = "part" + i;
  clone.children[3].setAttribute("value", part);
  clone.children[3].value = part;
  el.after(clone);
  if (clonable) { // Not clonable when created in the beginning with getExpense, but it is if created afterwards
    clone.addEventListener("input", function() {new_user_info(i+1, "", "", true)}, {once : true})
  }
}

// Shows the details of a single expense on a table and fills the modify_form
getExpense().then((expense) => {
  // Shows the details of a single expense on a table
  const table = document.getElementById("expense_table");
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
  // Pre-fill the modify form
  document.getElementById("date").setAttribute("value", expense.date); // date
  document.getElementById("description").setAttribute("value", expense.description); // description
  document.getElementById("category").setAttribute("value", expense.category); // category
  document.getElementById("total_cost").setAttribute("value", expense.total_cost); // total_cost
  // Pre-fill the users portion of the modify form
  let i = 1;
  Object.keys(expense.users).forEach((element) => {
    if (i === 1) {
      document.getElementById("user1").setAttribute("value", element);
      document.getElementById("part1").setAttribute("value", expense.users[element]);
    } else {
      new_user_info(i, element, expense.users[element], false);
    }
    i++;
  });
  // Void last user_info, the only one that gets the cloning trigger
  new_user_info(i, "", "", true);
});

// Gets from api a specific expense using id
async function getExpense() {
  const response = await fetch(`/api/budget/${y}/${m}/${id}`);
  const expense = await response.json();
  return expense;
}

// Calls api's delete
const delete_button = document.getElementById("delete_button");
delete_button.addEventListener("click", async (event) => {
  event.preventDefault();
  let result = window.confirm("Sei sicuro di voler eliminare la spesa?");
  if (result) {
    const response = await fetch(`/api/budget/${y}/${m}/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      alert("Spesa eliminata con successo! :)");
      window.location.replace("/");
    } else {
      alert("Ops! Qualcosa è andato storto");
    }
  }
});

// Calls api's put
const modify_expense_form = document.getElementById('modify_expense_form');
modify_expense_form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const date = document.getElementById('date').value.trim();
    const description = document.getElementById('description').value.trim();
    const category = document.getElementById('category').value.trim();
    const total_cost = document.getElementById('total_cost').value.trim();
    if (!date) {
        alert('Per favore, inserire una data');
        return;
    }

    // Creates users and makes sure the sum of all parts is equal to total_cost
    let users = {};
    let sum = 0;
    const users_html = document.getElementById('users');
    for (let i = 0; i < users_html.children.length; i++) {
        const username = document.getElementById("user" + (i+1)).value.trim();
        const userpart = parseFloat(document.getElementById("part" + (i+1)).value);
        if (username && userpart) {
            sum += userpart;
            users[username] = userpart;
        }
    }
    if (sum != total_cost) {
        alert('Attenzione! Il costo totale della spesa dev\'essere uguale alla somma delle parti di spesa degli utenti!');
        return;
    }

    const parts = date.split("-");
    const year = parts[0];
    const month = parts[1];
    // Calls api to create a new expense with chosen values
    const response = await fetch(`/api/budget/${year}/${month}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date, description, category, total_cost, users }),
    });
    if (!response.ok) {
        alert("Ops! Qualcosa è andato storto");
        return;
    } else {
        alert("Spesa modificata con successo! :)");
        window.location.replace(`/budget/${year}/${month}/${id}`);
        return;
    }
});