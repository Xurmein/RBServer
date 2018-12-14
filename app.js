require('dotenv').config();

var express = require('express');
var app = express();


var user = require('./controllers/usercontroller');
let admin = require('./controllers/admincontroller');
var journalentry = require('./controllers/journal-entrycontroller');

var sequelize = require('./db');

var bodyParser = require('body-parser');


sequelize.sync({force: true}); ///{force: true} to reset tables in DB

app.use(bodyParser.json());
app.use(require('./middleware/headers'));

app.use('/database/server-test', function(req, res){
    res.send("Its alive!")
})

app.use('/user', user);

app.use(require('./middleware/validate-session'))

app.use('/my/journals', journalentry);


app.listen(3000, () => {
    console.log('App is listening on 3000')
});