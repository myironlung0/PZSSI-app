const http = require('http');
const express = require('express');
const app = express();

// niezbędny body-parser i urlencoder
const bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.set('view engine', 'ejs'); //podlaczenie gen szablonow

const books = [];

app.get('/', function(req, res) {
    res.render('index',{messages:books}); //przesłanie wiadomości
});

app.post('/msg',urlencodedParser , function(req, res) {
    console.log("Message from client side: " + req.body.title);
    console.log("2nd message from client side: " + req.body.author);

    const title = req.body.title;
    const author = req.body.author;

    books.push({ //object literal
        title: title,
        author: author
    });

    //res.render('index', { messages: books }); // wysłanie całej listy
    res.redirect('/');
});

app.post('/delete', urlencodedParser, function(req,res){
    const idx = req.body.index; 
    console.log("Delete book " + idx);
    books.splice(idx, 1); //usuwanie elementu z tablicy
    
    res.redirect('/');
});

// ----- LAB 3-4 ------

// 1. POLACZENIE Z BAZA
var mongoose = require('mongoose');
var mongoDB = 'mongodb://127.0.0.1/books_db';
mongoose.connect(mongoDB);
var db = mongoose.connection;
db.on('error', console.error.bind(console,'MongoDB connection error:'));

// 2. TWORZENIE SCHEMATU
var Schema = mongoose.Schema;
const BookSchema = new Schema({
    title: String,
    author: String
});

// kompilacja modelu ze schematu
var BookModel = mongoose.model('BookModel', BookSchema);

// 3. TWORZENIE DOKUMENTU
var book = new BookModel();
//zapis
book.save().then(savedBook => {
  savedBook === book; // true
});

// 4. ODCZYT DOKUMENTOW Z BAZY
BookModel.find().then(books => {
  console.log(books);
});

const server = http.createServer(app);
const port = 8000;
server.listen(port);
console.debug('Server listening on port ' + port);