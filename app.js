const http = require('http');
const express = require('express');
const app = express();

// niezbędny body-parser i urlencoder
const bodyParser = require('body-parser');
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine', 'ejs'); //podlaczenie gen szablonow

// podlaczenie routera i controllera
const routes = require('./routes/books');
app.use('/', routes);

app.get('/add', function(req, res) {
    res.render('index.ejs');
});

const server = http.createServer(app);
const port = 8000;
server.listen(port);
console.debug('Server listening on port ' + port);

// 1. POLACZENIE Z BAZA
var mongoose = require('mongoose');
const { title } = require('process');
var mongoDB = 'mongodb://127.0.0.1/books_db';
mongoose.connect(mongoDB);
var db = mongoose.connection;
db.on('error', console.error.bind(console,'MongoDB connection error:'));


