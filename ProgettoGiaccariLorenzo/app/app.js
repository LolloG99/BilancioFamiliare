const express = require("express"); //load express
//const bootstrap = require('bootstrap'); //load bootstrap
const bodyParser = require("body-parser");
const fs = require("fs/promises");
const { MongoClient, ObjectId } = require("mongodb");
const session = require("express-session");
//const jwt = require('jsonwebtoken'); //for jwt approach

const uri = "mongodb://mongohost";
const app = express(); // build app

app.use(express.static(`${__dirname}/public`)); // resolve the public folder from any request
app.use(express.urlencoded());
app.use(express.json());
app.use(
  "/bootstrap",
  express.static(`${__dirname}/node_modules/bootstrap/dist/`)
); //use bootstrap

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  session({
    secret: "keyword",
    resave: false,
  })
);

// LOGIN, SIGNUP, LOGOUT, VERIFY

// Register page
app.get("/auth/signup", async (req, res) => {
  try {
    const data = await fs.readFile(`${__dirname}/public/register.html`, {
      encoding: `utf8`,
    });
    res.send(data);
  } catch (err) {
    console.log(err);
  }
});

// Actual register
app.post("/api/auth/signup", async (req, res) => {
  const client = new MongoClient(uri);
  await client.connect();
  const users = client.db("users");

  const new_user = {
    username: req.body.username,
    password: req.body.password,
    name: req.body.name,
    surname: req.body.surname,
  };
  try {
    const same_user = await users
      .collection("users")
      .findOne({ username: new_user.username });
    if (!same_user) {
      const db_user = await users.collection("users").insertOne(new_user);
      req.session.user = new_user;
    } else {
      res.statusMessage = "username already taken";
      res.status(403).send();
    }
  } catch (err) {
    // On failed register, it refreshes the page
    res.redirect("/auth/signup");
  }
});

// Login page
app.get("/auth/signin", async (req, res) => {
  try {
    const data = await fs.readFile(`${__dirname}/public/login.html`, {
      encoding: `utf8`,
    });
    res.send(data);
  } catch (err) {
    console.log(err);
  }
});

// Actual login
app.post("/api/auth/signin", async (req, res) => {
  const client = new MongoClient(uri);
  await client.connect();
  const users = client.db("users");
  try {
    const db_user = await users
      .collection("users")
      .findOne({ username: req.body.username });

    if (db_user && db_user.password === req.body.password) {
      //"if db_user" because if db_user is null code crashes
      //generateAccessToken(db_user); //for jwt approach
      req.session.user = db_user;
      res.redirect("/");
    } else {
      res.statusMessage = "wrong username or password";
      res.status(403).send();
    }
  } catch (err) {
    // On failed login, it refreshes the page
    res.redirect("/auth/signin");
  }
});

// Actual logout
app.post("/api/auth/logout", async (req, res) => {
  req.session.destroy();
  res.json({ message: "Logout successful!" });
});

// Authentication
async function verify(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    // If not authenticated, redirects to home
    //res.redirect("/");
    //res.status(403).send("Non autenticato :(");
    const data = await fs.readFile(`${__dirname}/public/unauthenticated.html`, {
      encoding: `utf8`,
    });
    res.send(data);
  }
}

// Protected route for TEST purposes
app.get("/api/restricted", verify, (req, res) => {
  res.json({
    message: "Welcome to the protected route!",
    user: req.session.user,
  });
});

// API AND HTML PAGES FETCHING

// GET /api/budget/ - logged user's expenses
app.get("/api/budget", verify, async (req, res) => {
  const client = new MongoClient(uri);
  await client.connect();
  const exps = client.db("expenses");

  const username = req.session.user.username;
  var query = {};
  query["users." + username] = { $exists: true };

  let expenses = await exps.collection("expenses").find(query).toArray();
  res.json(expenses);
});

// Fetches whoami.html page
app.get("/budget/whoami", verify, async (req, res) => {
  try {
    const data = await fs.readFile(`${__dirname}/public/whoami.html`, {
      encoding: `utf8`,
    });
    res.send(data);
  } catch (err) {
    console.log(err);
  }
});

// GET /api/budget/whoami - if authenticated, returns logged user's info
// Needs to be put before /api/budget/:year because otherwise that function will treat "whoami" as its year parameter
app.get("/api/budget/whoami", verify, async (req, res) => {
  const user = req.session.user;
  res.json(user);
});

// GET /api/budget/search?q=query - search expense that matches the query string
// Needs to be put before /api/budget/:year because otherwise that function will treat "search" as its year parameter
app.get("/api/budget/search", verify, async (req, res) => {
  const client = new MongoClient(uri);
  await client.connect();
  const exps = client.db("expenses");

  const username = req.session.user.username;
  const q = req.query.q;
  var query = {};
  query["users." + username] = { $exists: true };
  //Match the query string with expenses' dates, descriptions, categories, total_costs and hosts
  query["$or"] = [
    { date: { $regex: q, $options: "i" } },
    { description: { $regex: q, $options: "i" } },
    { category: { $regex: q, $options: "i" } },
    { total_cost: { $regex: q, $options: "i" } },
    { host: { $regex: q, $options: "i" } },
  ];

  let expenses = await exps.collection("expenses").find(query).toArray();
  res.json(expenses);
});

// GET /api/budget/:year - logged user's expenses in the chosen year
app.get("/api/budget/:year", verify, async (req, res) => {
  const client = new MongoClient(uri);
  await client.connect();
  const exps = client.db("expenses");

  const username = req.session.user.username;
  const year = req.params.year;
  var query = {};
  query["users." + username] = { $exists: true };
  query["date"] = { $regex: `${year}-` }; // Searches substrings of date that match the year and the dash

  let expenses = await exps.collection("expenses").find(query).toArray();
  res.json(expenses);
});

// GET /api/budget/:year/:month - logged user's expenses in the chosen year and month
app.get("/api/budget/:year/:month", verify, async (req, res) => {
  const client = new MongoClient(uri);
  await client.connect();
  const exps = client.db("expenses");

  const username = req.session.user.username;
  const year = req.params.year;
  const month = req.params.month;
  var query = {};
  query["users." + username] = { $exists: true };
  query["date"] = { $regex: `${year}-${month}-` }; // Searches substrings of date that match the year and month with appropriate dashes

  let expenses = await exps.collection("expenses").find(query).toArray();
  res.json(expenses);
});

// GET /budget/:year/:month/:id - to access the corresponding html page
app.get("/budget/:year/:month/:id", verify, async (req, res) => {
  try {
    const data = await fs.readFile(`${__dirname}/public/expense.html`, {
      encoding: `utf8`,
    });
    res.send(data);
  } catch (err) {
    console.log(err);
  }
});

// GET /api/budget/:year/:month/:id - logged user's expense of chosen id in the chosen year and month
app.get("/api/budget/:year/:month/:id", verify, async (req, res) => {
  const client = new MongoClient(uri);
  await client.connect();
  const exps = client.db("expenses");

  let expense = await exps
    .collection("expenses")
    .findOne({ _id: new ObjectId(req.params.id) });
  res.json(expense);
});

// GET /create-expense - html page to let logged user to add a new expense
app.get("/create-expense", verify, async (req, res) => {
  try {
    const data = await fs.readFile(`${__dirname}/public/createExpense.html`, {
      encoding: `utf8`,
    });
    res.send(data);
  } catch (err) {
    console.log(err);
  }
});

// POST /api/budget/:year/:month - Adding logged user's expense in the chosen year and month
app.post("/api/budget/:year/:month", verify, async (req, res) => {
  const client = new MongoClient(uri);
  await client.connect();
  const expenses = client.db("expenses");

  new_expense = {
    //temporary
    date: req.body.date, //'2024-01-28', //yyyy-mm-dd
    description: req.body.description, //'A dummy expense to test code',
    category: req.body.category, //'dinner',
    total_cost: req.body.total_cost, //240.50, //float
    users: req.body.users /*{
      lollo: req.body.total_cost / 2,
      johnci: req.body.total_cost / 2,
    },*/,
    host: req.session.user.username,
  };

  try {
    const db_expense = await expenses
      .collection("expenses")
      .insertOne(new_expense);
    res.status(201).json({ message: "Test expense added successfully! :)" });
  } catch (err) {
    res.status(500).json({ message: "Error :(" });
  }
});

// PUT /api/budget/:year/:month/:id - edit logged user's expense of chosen id in the chosen year and month
app.put("/api/budget/:year/:month/:id", verify, async (req, res) => {
  const client = new MongoClient(uri);
  await client.connect();
  const expenses = client.db("expenses");

  const filter = { _id: new ObjectId(req.params.id) };
  const updateEl = {
    $set: {
      //description: "This description has been modified successfully!",
      date: req.body.date,
      description: req.body.description,
      category: req.body.category,
      total_cost: req.body.total_cost,
      users: req.body.users,
    },
  };
  try {
    await expenses.collection("expenses").updateOne(filter, updateEl);
    res.json({ message: "Test expense modified successfully! :)" });
  } catch (err) {
    res.status(500).json({ message: "Error :(" });
  }
});

// DELETE /api/budget/:year/:month/:id - remove logged user's expense of chosen id in the chosen year and month
app.delete("/api/budget/:year/:month/:id", verify, async (req, res) => {
  const client = new MongoClient(uri);
  await client.connect();
  const expenses = client.db("expenses");

  try {
    await expenses
      .collection("expenses")
      .deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ message: "Test expense deleted successfully! >:)" });
  } catch (err) {
    res.status(500).json({ message: "Error :(" });
  }
});

// GET /api/balance - visualize give/take summary of logged user
app.get("/api/balance", verify, async (req, res) => {
  // Copypaste of get /api/budget
  const client = new MongoClient(uri);
  await client.connect();
  const exps = client.db("expenses");

  const username = req.session.user.username;
  var query = {};
  query["users." + username] = { $exists: true };

  let expenses = await exps.collection("expenses").find(query).toArray();

  // Calculate balance: list of debt or credit of other users with respect to the current user.
  // A positive value means that that other user should give money to the current user
  // A negative value means that the current user should give money to the other user
  let balance = {};
  expenses.forEach((expense) => {
    if (expense.total_cost === "0") {
      // If it's a refund
      Object.keys(expense.users).forEach((user) => {
        // Iter through the users (there's two of them)
        if (user !== username) {
          // If it's the other user
          if (!balance[user]) {
            balance[user] = 0;
          }
          balance[user] -= parseFloat(expense.users[user]); // Remove the other user's part (it works wether it's a refund from or to the other user)
        }
      });
    } else {
      if (expense.host === username) {
        // If the current user is the host
        Object.keys(expense.users).forEach((user) => {
          // Iter through the users
          if (user !== username) {
            // If the considered user is not the host
            if (!balance[user]) {
              balance[user] = 0;
            }
            balance[user] += parseFloat(expense.users[user]); // Add the user's part
          }
        });
      } else {
        if (!balance[expense.host]) {
          balance[expense.host] = 0;
        }
        balance[expense.host] -= parseFloat(expense.users[username]); // Remove the user's part from this expense's host if the current user is not the host
      }
    }
  });
  res.json(balance);
});

// GET /balance/:id - to access the corresponding html page
app.get("/balance/:id", verify, async (req, res) => {
  try {
    const data = await fs.readFile(
      `${__dirname}/public/balanceWithOther.html`,
      {
        encoding: `utf8`,
      }
    );
    res.send(data);
  } catch (err) {
    console.log(err);
  }
});

// GET /api/balance/:id - visualize give/take summary of logged user with user of chosen id
// username is used as id because it's unique
app.get("/api/balance/:id", verify, async (req, res) => {
  // Copypaste of get /api/budget
  const client = new MongoClient(uri);
  await client.connect();
  const exps = client.db("expenses");

  // Take all expenses where both users are involved and where one of them is the host
  const username = req.session.user.username;
  const other_user = req.params.id;
  var query = {};
  query["users." + username] = { $exists: true };
  query["users." + other_user] = { $exists: true };
  query["host"] = { $in: [username, other_user] };

  let expenses = await exps.collection("expenses").find(query).toArray();
  res.json(expenses);
});

// GET /api/users/search?q=query - searches user that matches query string
app.get("/api/users/search", verify, async (req, res) => {
  //it might not need verify middleware, it's a design choice!
  const client = new MongoClient(uri);
  await client.connect();
  const users = client.db("users");

  const q = req.query.q;
  var query = {};
  //Match the query string with users' usernames, names and surnames
  query["$or"] = [
    { username: { $regex: q, $options: "i" } },
    { name: { $regex: q, $options: "i" } },
    { surname: { $regex: q, $options: "i" } },
  ];

  let searched_users = await users.collection("users").find(query).toArray();
  res.json(searched_users);
});

app.listen(3000); //listen on port 3000

/* //For jwt approach

function generateAccessToken(user) {
    const payload = {
        username: user.username,
        name: user.name,
        surname: user.surname
    };

    const secret = 'secretkey';
    const options = { expiresIn: '1h' };

    return jwt.sign(payload, secret, options);
}

function verifyAccessToken(token) {
    const secret = 'secretkey';

    try {
        const decoded = jwt.verify(token, secret);
        return { success: true, data: decoded };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

function authenticateToken(req, res, next) {
    //console.log("REQUEST UGUALE A ", req);
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    

    if (!token) {
        return res.sendStatus(401);
    }

    const result = verifyAccessToken(token);

    if (!result.success) {
        return res.status(403).json({ error: result.error });
    }

    req.user = result.data;
    next();
} */
