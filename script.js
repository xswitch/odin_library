let myLibrary = [];
let deleteState = false;

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
    Object.keys(bookObj).forEach(key => {
        elements[key] = document.createElement('p');
        elements[key].textContent = bookObj[key];
        mainEntry.appendChild(elements[key]);
    })

    document.querySelector('main').appendChild(libEntry);
    return elements
}

// Creates the book object an elements and links them to the object.
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

const dummy = {
    name: 'Harry Potter',
    author: 'Some woman',
    pages: '500',
    read: true,
}

const dummy2 = {
    name: 'The Lies of Locke Lamora',
    author: 'Scott Lynch',
    pages: '500',
    read: true,
}

const dummy3 = {
    name: 'The way of kings',
    author: 'Brandon Sanderson',
    pages: '500',
    read: true,
}

const dummy4 = {
    name: 'Steelheart',
    author: 'Brandon Sanderson',
    pages: '500',
    read: true,
}
addBookToLibrary(dummy)
addBookToLibrary(dummy2)
addBookToLibrary(dummy3)
addBookToLibrary(dummy4)

// Sorts based on name or author.
function sortDescending(array, type) {
    myLibrary = array.sort((a, b) => {
        const nameA = a.elements[type].textContent.toLowerCase()
        const nameB = b.elements[type].textContent.toLowerCase()
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1
        return 0;
    });
    removeAllElements()
    repopulateEntries()
}

function sortAscending(array, type) {
    myLibrary = array.sort((a, b) => {
        const nameA = a.elements[type].textContent.toLowerCase()
        const nameB = b.elements[type].textContent.toLowerCase()
        if (nameA > nameB) return -1;
        if (nameA < nameB) return 1
        return 0;
    });
    removeAllElements()
    repopulateEntries()
}

// Creates all elements again
function repopulateEntries() {
    myLibrary.forEach(entry => {
        entry.elements = createBookElement(entry);
    });
}