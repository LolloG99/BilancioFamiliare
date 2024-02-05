// .js file that handles creation of an expense

const form = document.getElementById("create_expense_form");
let current_username = "";
// Array with all usernames to check wether a user that is part of the new expense being created exists in the users database
let all_usernames = [];

// Gets all users, saves their usernames and puts them as options for the html's userlist
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

const user_info_1 = document.getElementById("user_info_1");
// When user_info_1 is clicked on, it creates a new user_info
user_info_1.addEventListener(
  "input",
  function () {
    new_user_info(2);
  },
  { once: true }
);

// Function that creates a new user_info
function new_user_info(i) {
  const user_info_id = 'user_info_' + (i - 1);
  let el = document.getElementById(user_info_id);
  let clone = el.cloneNode(true);
  el.after(clone);
  clone.id = 'user_info_' + i;
  clone.querySelectorAll(`.user_info_element`)[0].htmlFor = "user" + i; // Label user
  clone.querySelectorAll(`.user_info_element`)[0].htmlFor = "user" + i; // Label user
  clone.querySelectorAll(`.user_info_element`)[1].id = "user" + i; // Textinput user
  clone.querySelectorAll(`.user_info_element`)[1].name = "user" + i;
  clone.querySelectorAll(`.user_info_element`)[1].setAttribute("value", "");
  clone.querySelectorAll(`.user_info_element`)[1].value = "";
  clone.querySelectorAll(`.user_info_element`)[2].htmlFor = "part" + i; // Label part
  clone.querySelectorAll(`.user_info_element`)[3].id = "part" + i; // Numberinput part
  clone.querySelectorAll(`.user_info_element`)[3].name = "part" + i;
  clone.querySelectorAll(`.user_info_element`)[3].setAttribute("value", "");
  clone.querySelectorAll(`.user_info_element`)[3].value = "";
  clone.addEventListener("input", function () { new_user_info(i + 1) }, { once: true })
}

// sets current_username and user_info_1's name field's value both to the current user's username
getUser().then((user) => {
  current_username = user.username;
  user_info_1
    .querySelectorAll(`.user_info_element`)[1]
    .setAttribute("value", current_username);
});

// user_info_1 updates dynamically its value when total_cost is modified (only if it hasn't been manually modified by the user yet)
document.getElementById("total_cost").addEventListener("input", () => {
  user_info_1
    .querySelectorAll(`.user_info_element`)[3]
    .setAttribute("value", total_cost.value);
});

// At submit, takes data and fetches api
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const date = document.getElementById("date").value.trim();
  const description = document.getElementById("description").value.trim();
  const category = document.getElementById("category").value.trim();
  const total_cost = document.getElementById("total_cost").value.trim();
  if (!date || !category || !total_cost) {
    return; // If one of the fields is empty, the function stops and lets bootstrap validation do its job
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
    window.location.reload();
  }
});

// Code from bootstrap docs for custom validation style and messages
// Apply custom Bootstrap validation styles to the form and prevent submission
form.addEventListener("submit", (event) => {
  if (!form.checkValidity()) {
    event.preventDefault();
    event.stopPropagation();
  }
  form.classList.add("was-validated");
});

// Gets users from api with specified query
async function getUsersQuery(query) {
  const response = await fetch(`/api/users/search?q=${query}`);
  const users = await response.json();
  return users;
}

// Gets from api the current user
async function getUser() {
  const response = await fetch(`/api/budget/whoami`);
  const user = await response.json();
  return user;
}
