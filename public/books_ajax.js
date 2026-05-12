function loadBooks(){
    fetch('/api/books')
    .then(res => res.json())
    .then(data => renderBooks(data));

}

function addBook(){
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    
    fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, author })
    })
    .then(res => res.json())
    .then(() => {
        loadBooks(); // odswiez tab
        // wyczysc pola
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
    });

}

function deleteBook(id) {
    fetch(`/api/books/${id}`, {
        method: 'DELETE'
    })
    .then(() => loadBooks());
}

function updateBook(id) {
    const newTitle = prompt("Podaj nowy tytul:");
    const newAuthor = prompt("Podaj nowego autora:");

    if (newTitle && newAuthor) {
        fetch(`/api/books/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: newTitle, author: newAuthor })
        })
        .then(() => loadBooks());
    }

}

// uruchom po zaladowaniu strony
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadBooks);
} else {
    loadBooks();
}


