// .js file that handles creation of a single expense in createExpense.html

const form = document.getElementById('create_expense_form');
const errorMessage = document.getElementById('error_message');

// At submit, takes data and fetches api
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const date = document.getElementById('date').value.trim();
    const description = document.getElementById('description').value.trim();
    const category = document.getElementById('category').value.trim();
    const total_cost = document.getElementById('total_cost').value.trim();
    if (!date) {
        errorMessage.textContent = 'Per favore, inserire una data';
        return;
    }

    // Creates users and makes sure the sum of all parts is equal to total_cost
    let users = {};
    let sum = 0;
    const users_html = document.querySelector('#users');
    for (let i = 0; i < users_html.children.length; i++) {
        const username = users_html.children[i].getElementsByClassName("user")[0].value.trim();
        const userpart = users_html.children[i].getElementsByClassName("part")[0].value.trim();
        if (username && userpart) {
            sum += userpart;
            users[username] = userpart;
        }
    }
    if (sum !== total_cost) {
        errorMessage.textContent = 'Attenzione! Il costo totale della spesa dev\'essere uguale alla somma delle parti di spesa degli utenti!';
        return;
    }

    const parts = date.split("-");
    const year = parts[0];
    const month = parts[1];
    // Calls api to create a new expense with chosen values
    const response = await fetch(`/api/budget/${year}/${month}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date, description, category, total_cost, users }),
    });
    if (!response.ok) {
        errorMessage.textContent = 'Qualcosa è andato storto! Spesa non aggiunta :(';
        return;
    } else {
        errorMessage.textContent = 'Spesa aggiunta con successo! :)';
        return;
    }
});