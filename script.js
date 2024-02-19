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

const dummyInputObject = {
    name: 'Night Angel',
    author: 'Brent Weeks',
    pages: 255,
    read: true,
}

const dummyInputObject2 = {
    name: 'Beer Crawler',
    author: 'Homie simpsons',
    pages: 35,
    read: true,
}

addBookToLibrary(dummyInputObject)
addBookToLibrary(dummyInputObject2)