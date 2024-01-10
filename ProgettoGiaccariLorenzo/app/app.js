const express = require("express"); //load express
const fs = require("fs/promises");
const { MongoClient } = require("mongodb");
const session = require("express-session");
//const jwt = require('jsonwebtoken'); //for jwt approach

const uri = "mongodb://mongohost";
const app = express(); // build app

app.use(express.static(`${__dirname}/public`)); // resolve the public folder from any request
app.use(express.urlencoded());
//app.use(express.json()); //for jwt approach
app.use(
  session({
    secret: "keyword",
    resave: false,
  })
);

// Register page
app.get("/api/auth/signup", async (req, res) => {
  try {
    const data = await fs.readFile(`${__dirname}/public/register.html`, {encoding: `utf8`});
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
    const same_user = await users.collection("users").findOne({ username: new_user.username });
    if (!same_user) {
      const db_user = await users.collection("users").insertOne(new_user);
      req.session.user = new_user;
      res.redirect("/api/restricted");
    } else {
        res.status(403).send("Username già presente, per favore sceglierne un altro");
    }
  } catch (err) {
    console.log(err);
  }
});

// Login page
app.get("/api/auth/signin", async (req, res) => {
  try {
    const data = await fs.readFile(`${__dirname}/public/login.html`, {encoding: `utf8`});
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
  const db_user = await users.collection("users").findOne({ username: req.body.username });

  /*
    db_user = { //temporary
        username: 'user',
        password: 'pass',
        name: 'Lorenzo',
        surname: 'Giaccari'
    }*/

  if (db_user && db_user.password === req.body.password) { //"if db_user" because if db_user is null code crashes
    //generateAccessToken(db_user); //for jwt approach
    req.session.user = db_user;
    res.redirect("/api/restricted");
  } else {
    res.status(403).send("Non autenticato :(");
  }
});

function verify(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.status(403).send("Non autenticato :(");
  }
}

app.get("/api/restricted", verify, (req, res) => {
  res.json({
    message: "Welcome to the protected route!",
    user: req.session.user,
  });
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
