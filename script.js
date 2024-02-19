const myLibrary = [];

function Book(name, author, pages, haveRead) {
    this.name = name;
    this.author = author;
    this.pages = pages;
    this.haveRead = haveRead
}

Book.prototype.logInfo = function() {
    console.log([this.name, this.author, this.pages, this.haveRead]);
}

function addBookToLibrary(inputObj) {
    const newBook = new Book(inputObj.name, inputObj.author, inputObj.pages, inputObj.read)
    newBook.logInfo();
    myLibrary.push(newBook);
}

// Shows extra content when clicking an entry
const libEntries = document.querySelectorAll('.libraryEntry')
libEntries.forEach(entry => {
    entry.addEventListener('click', () => {
        entry.classList.toggle('active')
        entry.querySelector('.hiddenEntry').classList.toggle('show');
    })
})

function toggleModal() {
    document.querySelector('.modal').classList.toggle('hidden')
}

document.querySelector('#createNewBook').addEventListener('click', toggleModal)
document.querySelector('.modal').addEventListener('click', toggleModal)