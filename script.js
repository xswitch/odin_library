let myLibrary = [];
let deleteState = false;
let sortDir = 0;

function Book(name, author, pages, haveRead) {
    this.name = name;
    this.author = author;
    this.pages = pages;
    this.haveRead = haveRead
}

Book.prototype.logInfo = function() {
    console.log(this);
}

Book.prototype.changeRead = function() {
    if (this.haveRead == true) {
        this.haveRead = false;
        this.elements.read.classList.add('notRead')
        this.elements.read.classList.remove('read')
    } else {
        this.haveRead = true;
        this.elements.read.classList.remove('notRead')
        this.elements.read.classList.add('read')
    }

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

// Checks if all fields are filled in except checkbox
function validate(inputObj) {
    let valid = true;
    let invalidElements = [];
    for (const input in inputObj) {
        const value = inputObj[input];
        if (input == 'read') break;
        if (value == '') {
            valid = false
            invalidElements.push(input)
        }
    }
    if (valid == false) invalid(invalidElements);
    return valid;
}

// Changes class on elements that are invalid
function invalid(elements) {
    if (elements.length == 0) return;
    const inputsToChange = document.querySelectorAll('.check')
    inputsToChange.forEach(input => {
        if (elements.includes(input.name)) input.classList.add('invalid')
    })
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
    // Read is treated differently because of icon
    Object.keys(bookObj).forEach(key => {
        elements[key] = (key != 'read') ? document.createElement('p') : document.createElement('div');
        if (key != 'read') {
            elements[key].textContent = bookObj[key];
        } else {
            console.log(bookObj[key]);
            (bookObj[key] == true) ? elements[key].classList.add('read') : elements[key].classList.add('notRead')
        }
        mainEntry.appendChild(elements[key]);
    })

    document.querySelector('main').appendChild(libEntry);
    return elements
}

// Creates the book object an elements and links them to the object.
function addBookToLibrary(inputObj) {
    const newBook = new Book(inputObj.name, inputObj.author, inputObj.pages, inputObj.read)
    newBook.elements = createBookElement(inputObj);
    newBook.elements.read.addEventListener('click', () => {
        newBook.changeRead()
    })
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

//Resets input elements
function resetInput() {
    const inputs = document.querySelectorAll('.newInput');
    inputs.forEach(input => {
        input.textContent = ''
        input.value = ''
        input.checked = false;
        input.classList.remove('invalid');
    })
}

// Removes all elements from every entry in myLibrary
function removeAllElements() {
    myLibrary.forEach(libEntry => {
        for (const entry in libEntry.elements) {
            libEntry.elements[entry].remove();
        }
        delete libEntry.elements
    })
}

// Creates all elements again
function repopulateEntries() {
    myLibrary.forEach(entry => {
        entry.elements = createBookElement(entry);
    });
}

// Removes entry at index
function removeEntry(index) {
    if (!confirm('Are you sure you want to delete this entry?')) return;
    const currentEntry = myLibrary[index];

    for (const element in currentEntry.elements) {
        currentEntry.elements[element].remove();
    }
    myLibrary.splice(index, 1);
}

// Looks for input in title and author
function search(string) {
    let results = []
    myLibrary.forEach(entry => {
        if (entry.elements.name.textContent.toLowerCase().includes(string) || entry.elements.author.textContent.toLowerCase().includes(string)) results.push(entry);
    });
    return(results);
}

// Changes classlists if it matches or doesn't in myLibrary array
function filterSearched(result) {
    myLibrary.forEach(entry => {
        if (!result.includes(entry)) {
            entry.elements.libraryEntry.classList.add('hidden')
        } else {
            entry.elements.libraryEntry.classList.remove('hidden')
        }
    })
}

// Sorts based on name or author.
function sort(array, type) {
    myLibrary = array.sort((a, b) => {
        const nameA = a.elements[type].textContent.toLowerCase()
        const nameB = b.elements[type].textContent.toLowerCase()
        if (sortDir == 0) {
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1
            return 0;
        } else {
            if (nameA > nameB) return -1;
            if (nameA < nameB) return 1
            return 0;
        }
    });
    (sortDir) ? sortDir = 0 : sortDir = 1;
    removeAllElements()
    repopulateEntries()
    filterSearched(search(document.querySelector('#findBook').value));
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
    if (validate(getInput())) {
        addBookToLibrary(getInput());
        console.log(getInput());
        resetInput()
    };
})
document.querySelector('#cancelCreateBook').addEventListener('click', (e) => {
    e.preventDefault()
    toggleModal()
    resetInput()
})
// If deleteState is on, get the index of clicked element and run removeEntry on it.
document.addEventListener('click', (e) => {
    if (!deleteState) return;
    myLibrary.forEach(entry => {
        for (const element in entry.elements) {
            if (entry.elements[element] == e.target) removeEntry(myLibrary.indexOf(entry));
        }
    });
})
// Changes delState and classes accordingly
document.querySelector('#deleteBooks').addEventListener('click', () => {
    if (deleteState) {
        deleteState = false;
        document.querySelectorAll('.libraryEntry').forEach(entry => {
            entry.classList.remove('delState')
        })
    } else {
        deleteState = true;
        document.querySelectorAll('.libraryEntry').forEach(entry => {
            entry.classList.add('delState')
        })
    }
})
// Searching
document.querySelector('#findBook').addEventListener('input', (e) => {
    filterSearched(search(document.querySelector('#findBook').value));
})

// SORTING
document.querySelector('.column-title').addEventListener('click', () => {
    sort(myLibrary, 'name')
})

document.querySelector('.column-author').addEventListener('click', () => {
    sort(myLibrary, 'author')
})

document.querySelector('.column-pages').addEventListener('click', () => {
    sort(myLibrary, 'pages')
})

const dummy = {
    name: 'Harry Potter',
    author: 'Some woman',
    pages: '2',
    read: true,
}

const dummy2 = {
    name: 'The Lies of Locke Lamora',
    author: 'Scott Lynch',
    pages: '50',
    read: true,
}

const dummy3 = {
    name: 'The way of kings',
    author: 'Brandon Sanderson',
    pages: '20',
    read: true,
}

const dummy4 = {
    name: 'Steelheart',
    author: 'Brandon Sanderson',
    pages: '5000',
    read: true,
}
addBookToLibrary(dummy)
addBookToLibrary(dummy2)
addBookToLibrary(dummy3)
addBookToLibrary(dummy4)
