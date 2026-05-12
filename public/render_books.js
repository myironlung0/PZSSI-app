function renderBooks(books){
    const tableBody = document.getElementById('bookTableBody');
    if (!tableBody) return;
    tableBody.innerHTML = ''; // tabele czyszcze

    for (let i = 0; i < books.length; i++) {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = books[i].title;
        row.insertCell(1).textContent = books[i].author;
        
        const actionsCell = row.insertCell(2);
        actionsCell.innerHTML = `<button onclick="deleteBook('${books[i]._id}')">Usun</button>
                                <button onclick="updateBook('${books[i]._id}')">Edytuj</button>`;
    }


}