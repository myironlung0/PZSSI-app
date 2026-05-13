function loadBooks(){
    $.ajax({
        url: '/api/books',
        method: 'GET',
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
    
    $.ajax({
        url: '/api/books',
        method: 'POST',
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
    loadBooks(); // odswiez tab
            // wyczysc pola
            document.getElementById('title').value = '';
            document.getElementById('author').value = '';
}

function deleteBook(id) {
    $.ajax({
        url: `/api/books/${id}`,
        method: 'DELETE',
        success: function(){
            loadBooks();
        },
        error: function(err){
            console.error('Error deleting book:', err);
        }
    })
    .then(() => loadBooks());
}

function updateBook(id) {
    const newTitle = prompt("Podaj nowy tytul:");
    const newAuthor = prompt("Podaj nowego autora:");

    if (newTitle && newAuthor) {
        $.ajax({
            url: `/api/books/${id}`,
            method: 'PUT',
            data: JSON.stringify({ title: newTitle, author: newAuthor }),
            contentType: 'application/json',
            success: function(){
                loadBooks();
            },
            error: function(err){
                console.error('Error updating book:', err);
            }
        });
    }
}

// uruchom po zaladowaniu strony
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadBooks);
} else {
    loadBooks();
}


