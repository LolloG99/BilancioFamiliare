// .js file that handles visualization of a single user

// Shows the details of a single expense on a table
getUser().then(user => {
    const table = document.querySelector("#user_table");
    const tr = document.createElement("tr");
    const username = document.createElement("username");
    const name = document.createElement("name");
    const surname = document.createElement("surname");
    username.innerText = user.username;
    name.innerText = user.name;
    surname.innerText = user.surname;
    table.appendChild(tr);
    tr.appendChild(username);
    tr.appendChild(name);
    tr.appendChild(surname);
})

// Gets from api the current user
async function getUser() {
    const response = await fetch(`/api/budget/whoami`);
    const user = await response.json();
    return user;
}
