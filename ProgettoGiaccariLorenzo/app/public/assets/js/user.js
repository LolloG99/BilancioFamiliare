// .js file that handles visualization of a single user

// Shows the details of a single expense on a table
getUser().then(user => {
    const table = document.getElementById("user_table");
    const tr = document.createElement("tr");
    const username = document.createElement("td");
    const name = document.createElement("td");
    const surname = document.createElement("td");
    username.innerText = user.username;
    name.innerText = user.name;
    surname.innerText = user.surname;
    table.appendChild(tr);
    tr.appendChild(username);
    tr.appendChild(name);
    tr.appendChild(surname);
})

getBalance().then(balance => {
    const table = document.getElementById("balance_table");
    Object.keys(balance).forEach((user) => {
        const tr = document.createElement("tr");
        const username = document.createElement("td");
        const debt = document.createElement("td");
        username.innerText = user;
        debt.innerText = balance[user];
        table.appendChild(tr);
        tr.appendChild(username);
        tr.appendChild(debt);
    })
})

// Gets from api the current user
async function getUser() {
    const response = await fetch(`/api/budget/whoami`);
    const user = await response.json();
    return user;
}

async function getBalance() {
    const response = await fetch(`/api/balance`);
    const balance = await response.json();
    return balance;
}