const express = require('express');
const app = express();

app.use(express.static(`${__dirname}/public`));
app.get('/json/:prova', (req, res) => {

});

app.listen(3000);