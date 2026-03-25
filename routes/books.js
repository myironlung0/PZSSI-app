const express = require('express');
const router = express.Router();
const BookModel = require('../models/book');

// REST API 
router.get('/', function(req, res) {
    BookModel.find()
    .then(allBooks => {
        res.status(200).json(allBooks);
    })
    .catch(err => {
        res.status(500).json({ error: err.message });
    });

    
});


router.post('/', async function(req, res){
    console.log("Message from client side: " + req.body.title);
    console.log("2nd message from client side: " + req.body.author);

    const title = req.body.title;
    const author = req.body.author;

    const book = new BookModel({
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

router.delete("/:id", async function(req,res) {
     const id = req.params.id;

    await BookModel.deleteOne({_id : id});
    // await BookModel.findByIdAndDelete

    res.status(200);
    
})


module.exports = router;