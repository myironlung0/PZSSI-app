const http = require('http');
const express = require('express');
const app = express();

// niezbędny body-parser i urlencoder
const bodyParser = require('body-parser');
app.use(express.json()); // parsowanie json dla api, middleware dla api
const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.json());

app.set('view engine', 'ejs'); //podlaczenie gen szablonow

// 1. POLACZENIE Z BAZA
var mongoose = require('mongoose');
const { title } = require('process');
var mongoDB = 'mongodb://127.0.0.1/books_db';
mongoose.connect(mongoDB);
var db = mongoose.connection;
db.on('error', console.error.bind(console,'MongoDB connection error:'));

// podlaczenie routera i controllera
const routes = require('./routes/api/books');
app.use('/api/books', routes);

//import bookModel - przeniesiony do models
const BookModel = require('./models/book');

app.get('/', function(req, res) {
    BookModel.find()
        .then(allBooks => {
            res.render('index', { messages: allBooks });
        });
});

app.post('/msg',urlencodedParser , function(req, res) {
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
    })
    .catch(err => {
        console.log("Error while saving book");
    });

    res.redirect('/');
});

app.post('/delete', urlencodedParser, async function(req,res){
    const id = req.body._id;

    await BookModel.deleteOne({_id : id});
    // await BookModel.findByIdAndDelete

    res.redirect('/');
});

app.get('/update/:id', async function(req, res) {
    const book = await BookModel.findById(req.params.id);

    res.render('update', {book})
});

app.post('/update', urlencodedParser, async function(req,res){
    const id = req.body._id;

    await BookModel.updateOne({_id : id}, 
        {
            title : req.body.title, 
            author : req.body.author
        });
        
    res.redirect('/');
    
});

const server = http.createServer(app);
const port = 8000;
server.listen(port);
console.debug('Server listening on port ' + port);




// pod /api json zwracam, tam jest api, a tak to aplikacja jak normalnie.