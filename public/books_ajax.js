let editingBookId = null; 

function loadBooks(){
    $.ajax({
        url: '/api/books',
        type: 'GET',
        success: function(books){
            renderBooks(books);
        },
        error: function(err){
            console.error('Error fetching books:', err);
        }
    });
}

function addBook(){
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;

    if (!title || !author) {
        alert('Wypełnij wszystkie pola!');
        return;
    }

    if (editingBookId) {
        // Edytowanie książki
        $.ajax({
            url: `/api/books/${editingBookId}`,
            type: 'PUT',
            data: JSON.stringify({ title, author }),
            contentType: 'application/json',
            success: function(){
                loadBooks();
                clearForm();
                editingBookId = null;
            },
            error: function(err){
                console.error('Error updating book:', err);
            }
        });
    } else {
        // Dodawanie nowej książki
        $.ajax({
            url: '/api/books',
            type: 'POST',
            data: JSON.stringify({ title, author }),
            contentType: 'application/json',
            success: function(){
                loadBooks();
                document.getElementById('title').value = '';
                document.getElementById('author').value = '';
            },
            error: function(err){
                console.error('Error adding book:', err);
            }
        });
    }
}

function clearForm() {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    editingBookId = null;
}

function deleteBook(id) {
     $.ajax({
        url: `/api/books/${id}`,
        type: 'DELETE',
        success: function(){
            loadBooks();
        },
        error: function(err){
            console.error('Error deleting book:', err);
        }
    });
}

function updateBook(id) {
    $.ajax({
        url: `/api/books/${id}`,
        type: 'GET',
        success: function(book){
            document.getElementById('title').value = book.title;
            document.getElementById('author').value = book.author;
            editingBookId = id;
        },
        error: function(err){
            console.error('Error fetching book:', err);
        }
    });
}