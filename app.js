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
const server = http.createServer(app);
const port = 8000;
server.listen(port);
console.debug('Server listening on port ' + port);


// app.get('/', function(req, res) {
//     BookModel.find()
//         .then(allBooks => {
//             res.render('index', { messages: allBooks });
//         });
// });

// REST API 
app.get('/api/books', function(req, res) {
    BookModel.find()
    .then(allBooks => {
        res.status(200).json(allBooks);
    })
    .catch(err => {
        res.status(500).json({ error: err.message });
    });

    
});

app.post('/api/msg', bodyParser, function(req, res){
    console.log("Message from client side: " + req.body.title);
    console.log("2nd message from client side: " + req.body.author);

    const id = req.body._id;
    const title = req.body.title;
    const author = req.body.author;

    const book = new BookModel({
        id,
        title,
        author
    });

    book.save()
    .then(savedBook => {
        console.log("Saved book:", savedBook);
        savedBook === book;
        res.json(book);
    })
    .catch(err => {
        console.log("Error while saving book");
        res.status(201).send(book);
    });
});

// app.post('/delete', bodyParser, async function(req,res){
//     // const idx = req.body.index; 
//     // console.log("Delete book " + idx);
//     // books.splice(idx, 1); //usuwanie elementu z tablicy

//     const id = req.body._id;

//     await BookModel.deleteOne({_id : id});
//     // await BookModel.findByIdAndDelete

//     res.redirect('/');
// });

// app.get('/update/:id', async function(req, res) {
//     const book = await BookModel.findById(req.params.id);

//     res.render('update', {book})
// });

// app.post('/update', bodyParser, async function(req,res){
//     const id = req.body._id;

//     // const document = BookModel.find({_id : id});
//     // document.title = req.body.title;
//     // document.author = req.body.title;
//     // await document.save();

//     await BookModel.updateOne({_id : id}, 
//         {
//             title : req.body.title, 
//             author : req.body.author
//         });
        
//     res.redirect('/');
    
// });

// 1. POLACZENIE Z BAZA
var mongoose = require('mongoose');
const { title } = require('process');
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
