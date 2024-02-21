const myLibrary = [];

function Book(name, author, pages, haveRead) {
    this.name = name;
    this.author = author;
    this.pages = pages;
    this.haveRead = haveRead
}

Book.prototype.logInfo = function() {
    console.log(this);
}

// Stores all values in keys equal to "name" in html
function getInput() {
    const inputElements = document.querySelectorAll('.newInput');
    let inputObj = {}

    inputElements.forEach(element => {
        if (inputObj.hasOwnProperty(element.name)) return;
        if (element.type != 'checkbox') {
            inputObj[element.name] = element.value;
        } else {
            inputObj[element.name] = element.checked;
        }
    })
    return inputObj;
}

// Creates elements from the keys of bookObj in addition to the usual ones.
function createBookElement(bookObj) {
    elements = {
        libraryEntry: document.createElement('div'),
        mainEntry: document.createElement('div'),
        hiddenEntry: document.createElement('div'),
    }

    const libEntry = elements.libraryEntry;
    const mainEntry = elements. mainEntry;
    const hidEntry = elements.hiddenEntry;
    libEntry.classList.add('libraryEntry')
    mainEntry.classList.add('mainEntry')
    hidEntry.classList.add('hiddenEntry');

    libEntry.addEventListener('click', () => {
        libEntry.classList.toggle('active');
        hidEntry.classList.toggle('show')
    })
    
    libEntry.appendChild(elements.mainEntry);
    libEntry.appendChild(elements.hiddenEntry);

    // Creates elements for each input and stores them.
    Object.keys(bookObj).forEach(key => {
        elements[key] = document.createElement('p');
        elements[key].textContent = bookObj[key];
        mainEntry.appendChild(elements[key]);
    })

    document.querySelector('main').appendChild(libEntry);
    return elements
}


function addBookToLibrary(inputObj) {
    const newBook = new Book(inputObj.name, inputObj.author, inputObj.pages, inputObj.read)
    newBook.elements = createBookElement(inputObj);
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

function resetInput() {
    const inputs = document.querySelectorAll('.newInput');
    inputs.forEach(input => {
        input.textContent = ''
        input.value = ''
        input.checked = false;
    })
}

// Event listeners
document.querySelector('#createNewBook').addEventListener('click', toggleModal)
document.querySelector('.modal').addEventListener('click', (e) => {
    if (e.target == document.querySelector('.modal')) {
        toggleModal()
        resetInput()
    }
})
document.querySelector('#createBook').addEventListener('click', (e) => {
    e.preventDefault()
    addBookToLibrary(getInput());
    resetInput()
})
document.querySelector('#cancelCreateBook').addEventListener('click', (e) => {
    e.preventDefault()
    toggleModal()
    resetInput()
})
