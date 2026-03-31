const express = require('express');
const router = express.Router();
const BookModel = require('../../models/book');

// REST API 
router.get('/', async function(req, res) {
    try{
        const books = await BookModel.find();
        res.status(200).json(books);
    }catch (error){
        res.status(500).json({ error: error.message });
    }
});


// get /api/books/:id - wyswietlanie jednej
router.get('/:id', async (req, res) => {
    try {
        const book = await BookModel.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Nie znaleziono ksiazki' });
        }
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// post /api/books - dodawanie
router.post('/', async function(req, res){
    // console.log("Message from client side: " + req.body.title);
    // console.log("2nd message from client side: " + req.body.author);

    try{
        const title = req.body.title;
        const author = req.body.author;

        const book = new BookModel({
            title,
            author
        });

        const savedBook = await book.save();
        res.status(201).json(savedBook)
    }catch(error){
        res.status(500).json({error: error.message});
    }
});

// put - modyfikacja wybranej ksiazki
router.put("/:id", async function(req, res){
    try{
        const title = req.body.title;
        const author = req.body.author;

        const modifiedBook = await BookModel.findByIdAndUpdate(req.params.id, {title: title, author: author}, {new: true}); //[options.new=false] «boolean» if true, return the modified document rather than the original

        if (!modifiedBook) {
            return res.status(404).json({ message: 'Nie znaleziono ksiazki' });
        }
        
        res.status(200).json(modifiedBook);

    }catch(error){
        res.status(500).json({error: error.message});
    }
});

// delete - usuwanie
router.delete("/:id", async function(req,res) {
    try{
        const id = req.params.id;

        await BookModel.deleteOne({_id : id});
        //  const deletedBook = await BookModel.findByIdAndDelete(req.params.id);
       
        res.status(200).json({ message: 'Usunieto', book: deletedBook }); // dobra  praktyka jest zwrocic to, co usuwamy
    }catch(error){
        res.status(500).json({error: error.message})
    }
});




module.exports = router;