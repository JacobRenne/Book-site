let library = []
let searchArray = []

if (JSON.parse(localStorage.getItem('library')) != null) {
    library = JSON.parse(localStorage.getItem('library'))
}

class createBook {
    constructor(title, author, pages, readOrNot) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.readOrNot = readOrNot;
    }
}

// Adds new book to array then updates display
function addBookToArray (title, author, pages, readOrNot, parent, array) {
    array.push(new createBook(title, author, pages, readOrNot))
    display(parent, array)
}

// Removes children of given element
function clearChildren(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

const navLibrary = document.querySelector('.nav-library')
const navSearch = document.querySelector('.nav-search')

// Loops through an array and displays the items
function display (parent, array) {
    clearChildren(parent)
    
    array.forEach((book, i) => {
        let div = document.createElement('div')
        div.id = `book${i}`
        parent.appendChild(div)

        let title = document.createElement('h3')
        title.textContent = array[i].title
        div.appendChild(title)

        if (array[i].author != '' && array[i].author != null) {
            let author = document.createElement('p')
            author.textContent = `Author: ${array[i].author}`
            div.appendChild(author)
        }

        if (array[i].pages != '' && array[i].pages != null) {
            let pages = document.createElement('p')
            pages.textContent = `Pages: ${array[i].pages}`
            div.appendChild(pages)
        }

        // Read Or Not button on each book (Library page)
        if (navLibrary.style.backgroundColor == 'rgb(233, 229, 205)') {
            let read = document.createElement('button')
            read.id = `readOrNot${i}`

            if (array[i].readOrNot === null) {
                read.textContent = 'Not Read'
            }
            else {
                read.textContent = array[i].readOrNot
            }
            div.appendChild(read)
            read.style.backgroundColor = array[i].readOrNot === 'Read' ? 'rgba(0, 255, 34, 0.247)' : 'white' 

            read.addEventListener('click', () => {
                let readState = read.textContent === 'Read'
                read.textContent = readState ? 'Not Read' : 'Read'
                let idToNumber = read.parentElement.id.replace(/\D/g, '')
                array[idToNumber].readOrNot = read.textContent
                read.style.backgroundColor = readState ? 'white' : 'rgba(0, 255, 34, 0.247)'

                localStorage.clear();
                localStorage.setItem('library', JSON.stringify(library))
            })
        }

        // Remove button on each book (Library page)
        if (navLibrary.style.backgroundColor == 'rgb(233, 229, 205)') {
            let removeButton = document.createElement('button')
            removeButton.id = `remove${i}`
            removeButton.textContent = 'REMOVE'
            div.appendChild(removeButton)
            removeButton.addEventListener('click', () => {
                let idToNumber = removeButton.parentElement.id.replace(/\D/g, '')
                console.log(idToNumber)
                array.splice(Number(idToNumber), 1)
                removeButton.parentElement.remove()

                display(bookDisplay, library)

                localStorage.clear();
                localStorage.setItem('library', JSON.stringify(library))
            })
        }

        // Add button on each book (Search page)
        if (navSearch.style.backgroundColor == 'rgb(233, 229, 205)') {
            let addToLibrary = document.createElement('button')
            addToLibrary.id = `added${i}`
            addToLibrary.textContent = 'ADD'
            div.appendChild(addToLibrary)
            addToLibrary.addEventListener('click', () => {
                library.push(array[i])
                addToLibrary.remove()
                
                localStorage.clear();
                localStorage.setItem('library', JSON.stringify(library))
            })
        }
    })
}

// Buttons
const addButton = document.querySelector('#add-button')
const bookForm = document.querySelector('#book-form')
const formTitle = document.querySelector('#form-title')
const formAuthor = document.querySelector('#form-author')
const formPages = document.querySelector('#form-pages')
const bookDisplay = document.querySelector('.book-display')

if (addButton != null) {
    // Toggles add button visibility
    addButton.addEventListener('click', () => {
        let isVisible = bookForm.style.display === 'flex';
        bookForm.style.display = isVisible ? 'none' : 'flex';
    
        formTitle.value = null;
        formAuthor.value = null;
        formPages.value = null;
    })
    
    const formRead = document.querySelector('#form-read')
    formRead.addEventListener('click', () => {
        if (formRead.textContent === 'NOT READ') {
            formRead.textContent = 'Read'
            formRead.style.backgroundColor = 'rgba(0, 255, 34, 0.247)'
        }
        else {
            formRead.textContent = 'NOT READ'
            formRead.style.backgroundColor = 'white'
        }
    })
    
    const submitButton = document.querySelector('#form-submit')
    submitButton.addEventListener('click', (event) => {
        event.preventDefault()
        addBookToArray(
            formTitle.value,
            formAuthor.value,
            formPages.value,
            formRead.textContent,
            bookDisplay,
            library,
        )
        let visibility = bookForm.style.display === 'flex'
        bookForm.style.display = visibility ? 'none' : 'flex'

        localStorage.clear();
        localStorage.setItem('library', JSON.stringify(library))
    })
}

function displayLoading() {
    document.querySelector('#loading-text').style.display = 'block'
}
function hideLoading() {
    document.querySelector('#loading-text').style.display = 'none'
}

// Fetch stuff
const searchButton = document.querySelector('#search-button')
const searchBar = document.querySelector('#search-bar')
let authorList = []
let chartTitle = document.querySelector('#chart-title')

// Fetch actions start when pressing the search button
if (searchButton != null) {
    searchBar.addEventListener('keydown', (event) => {
        if (event.keyCode === 13) {
            event.preventDefault()
        }
    })

    searchButton.addEventListener('click', (event) => {
        event.preventDefault()
        displayLoading()

        clearChildren(bookDisplay)
        searchArray = []
    
        let searchValue = searchBar.value.replace(/ /g, '+')
        fetch(`https://openlibrary.org/search.json?q=${searchValue}&limit=20`)
            .then(response => {
                return response.json()
            })
            .then(data => {
                fullFetchData = data
                data.docs.slice(0, 20).forEach((doc, i) => {

                    let author;

                    if (Array.isArray(doc.author_name)) {
                        author = doc.author_name
                        authorList.push(author[0])
                        if (author.length > 1) {
                            author = `${author[0]}, etc`
                        }
                        else {
                            author = author[0]
                        }
                    }
                    else {
                        author = 'unknown' 
                        authorList.push('Unknown')
                    }

                    addBookToArray(
                        doc.title,
                        author,
                        null,
                        null,
                        bookDisplay,
                        searchArray,
                    )
                })
                hideLoading()

                createChart()
                document.querySelector('#chart-title').style.visibility = 'visible'
            })
    })
}

// CHART
let chartVar = null

// Counts authors book amounts
function countAuthorBooks(array) {
    let authorCounting = {}
    array.forEach(author => {
        if (authorCounting[author] != undefined) {
            authorCounting[author]++
        }
        else {
            authorCounting[author] = 1;
        }
    })
    console.log(authorCounting)
    return authorCounting
}

// Creates chart based on author count 
function createChart() {
    let authorCount = countAuthorBooks(authorList)
    let labels = Object.keys(authorCount)
    let data = Object.values(authorCount)
    
    const ctx = document.querySelector('#chart').getContext('2d');
    
    if (chartVar != null) {
        chartVar.destroy()
    }

    chartVar = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'Author book amount',
                data: data,
                backgroundColor: [
                    '#FF6384', 
                    '#36A2EB', 
                    '#FFCE56', 
                    '#4BC0C0', 
                    '#9966FF', 
                    '#FF9F40', 
                    '#E6E6FA', 
                    '#8A2BE2', 
                    '#FFA07A', 
                    '#20B2AA'  
                ],
                borderColor: [
                    '#FFFFFF',
                ],
                hoverOffset: 4
            }]
        }
    })
    authorList = []
}

if (navLibrary.style.backgroundColor === 'rgb(233, 229, 205)') {
    display(bookDisplay, library)
}