const http = require('http');
const express = require('express');
const app = express();

// niezbędny body-parser i urlencoder
const bodyParser = require('body-parser');
app.use(express.json()); // parsowanie json dla api, middleware dla api
app.use(express.static('public')); // static files css js
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


// swagger
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/api-docs', swaggerUi.serve,
swaggerUi.setup(swaggerDocument));

//import bookModel - przeniesiony do models
const BookModel = require('./models/book');

app.get('/', function(req, res) {
    BookModel.find()
        .then(allBooks => {
            res.render('index', { messages: allBooks });
        });
});

app.post('/msg',urlencodedParser , function(req, res) {
    console.log("Book title: " + req.body.title);
    console.log("Author name: " + req.body.author);

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




// GRAPHQL

var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');


var schema = buildSchema(`
    input BookInput {
        title: String
        author: String
    }
    type Book {
        id: ID!
        title: String
        author: String
    }
    type Query {
        getBook(id: ID!): Book
        getBooks: [Book!]!
    }
    type Mutation {
        createBook(input: BookInput): Book
        updateBook(id: ID!, input: BookInput): Book
        deleteBook(id:ID!): Book
    }   
`);

var root = {
    getBook: async ({id}) => {
        const book = await BookModel.findById(id);
        if (!book) {
            throw new Error('No book exists with id ' + id);
        }
        return book;
    },

    getBooks: async () => {
        return await BookModel.find();
    },

    createBook: async ({input}) => {
        const id = input._id;
        const title = input.title;
        const author = input.author;

        const book = new BookModel({
            id,
            title,
            author
        });

        return await book.save();
    },

    updateBook: async ({id, input}) => {
        const updated = await BookModel.findByIdAndUpdate(id,{title: input.title, author: input.author},{ new: true });

        if (!updated) {
            throw new Error('No book exists with id ' + id);
        }

        return updated;
    },

    deleteBook: async ({id}) =>{
        const deleted = await BookModel.findByIdAndDelete(id);

        if(!deleted){
            throw new Error('No book exists with id ' + id);
        }

        return deleted;
    }
};

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));

const server = http.createServer(app);
const port = 8000;
server.listen(port);
console.debug('Server listening on port ' + port);

console.log('Running a GraphQL API server at http://localhost:8000/graphql');
