function loadBooks(){
    fetch('/api/books')
    .then(res => res.json())
    .then(data => renderBooks(data));

}

function addBook(title, author){
    fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, author })
    })
    .then(res => res.json())
    .then(() => loadBooks());
}

function deleteBook(id) {
    fetch(`/api/books/${id}`, {
        method: 'DELETE'
    })
    .then(res => res.json())
    .then(() => loadBooks());
}

function updateBook(id, title, author) {
    fetch(`/api/books/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, author })
    })
    .then(res => res.json())
    .then(() => loadBooks());
}


