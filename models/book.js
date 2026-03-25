var mongoose = require('mongoose');

// 2. TWORZENIE SCHEMATU
var Schema = mongoose.Schema;
const BookSchema = new Schema({
    title: String,
    author: String
});

// kompilacja modelu ze schematu
//var BookModel = 
// eksportuje model
module.exports = mongoose.model('BookModel', BookSchema);