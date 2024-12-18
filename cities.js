const tableBody = document.querySelector('#table-body')
const cityDisplay = document.querySelector('#cities-display')
const formId = document.querySelector('#city-id')
const formName = document.querySelector('#city-name')
const formPop = document.querySelector('#city-pop')
const editSubmit = document.querySelector('#city-submit')

const addName = document.querySelector('#city-name-add')
const addPop = document.querySelector('#city-pop-add')
const addSubmit = document.querySelector('#city-add')

// Fetches cities then displays them
async function fetchDisplay() {
    try {
        const response = await fetch('https://avancera.app/cities/')
        const cities = await response.json()
        
        tableBody.innerHTML = ''

        cities.forEach(city => {
            let row = document.createElement('tr')
            tableBody.appendChild(row)

            let idCell = document.createElement('td')
            idCell.textContent = city.id
            row.appendChild(idCell)

            let nameCell = document.createElement('td')
            nameCell.textContent = city.name
            row.appendChild(nameCell)

            let popCell = document.createElement('td')
            popCell.textContent = city.population
            row.appendChild(popCell)

            let editCell = document.createElement('td')
            editCell.textContent = 'EDIT'
            editCell.classList.add('display-buttons')
            row.appendChild(editCell)
            editCell.addEventListener('click', () => {
                cityEdit(city.id, city.name, city.population)
            })

            let deleteCell = document.createElement('td')
            deleteCell.textContent = 'DELETE'
            deleteCell.classList.add('display-buttons')
            row.appendChild(deleteCell)
            deleteCell.addEventListener('click', () => {
                deleteCity(city.id)
            })
        })  
    } catch (error) {
        console.error(error)
        alert('Fetch failed. Please read console for error code')
    }
}


// Takes arguments and places them in the edit form
function cityEdit(id, name, population) {
    formId.value = id
    formName.value = name
    formPop.value = population
}

// Adds event listener to edit submit button
editSubmit.addEventListener('click', (event) => {
    event.preventDefault()
    submitEdit()
})

// Takes values in the edit form and sends it to API
async function submitEdit() {
    const id = formId.value
    const nameValue = formName.value
    const popValue = parseInt(formPop.value)

    let check = await checkForDuplicates()
    
    if (check === 'duplicate') {
        alert('No duplicate city names')
        return
    }

    if (check === 'unique') {
        try {
            const response = await fetch(`https://avancera.app/cities/${id}`, {
                body: JSON.stringify({ name: nameValue, population: popValue }),
                headers: {'Content-Type': 'application/json'},
                method: 'PATCH'
            })
            fetchDisplay()
    
        } catch (error) {
            console.error(error)
            alert('Edit failed. Please read console for error code')
        }       
    }
    else if (check === 'current') {
        try {
            const response = await fetch(`https://avancera.app/cities/${id}`, {
                body: JSON.stringify({ population: popValue }),
                headers: {'Content-Type': 'application/json'},
                method: 'PATCH'
            })
            fetchDisplay()
    
        } catch (error) {
            console.error(error)
            alert('Edit failed. Please read console for error code')
        }
    }
}


// Checks if there are duplicate names
async function checkForDuplicates() {
    let response = await fetch('https://avancera.app/cities/')
    let cities = await response.json()

    for (let i = 0; i < Object.keys(cities).length; i++) {
        if (cities[i].name === formName.value){
            if (cities[i].id != formId.value) {
                return 'duplicate'
            }
            return 'current'
        }
    }
    return 'unique'
}

// Adds eventlistener to add submit button
addSubmit.addEventListener('click', (event) => {
    event.preventDefault()
    addCity()
})

// Takes values in add form and sends it to API
async function addCity() {
    const nameValue = addName.value
    const popValue = parseInt(addPop.value)

    if (nameValue === '' || popValue === '') {
        alert('Please fill the form')
        return
    }

    try {
        const response = await fetch('https://avancera.app/cities/', {
            body: JSON.stringify({ name: nameValue, population: popValue }),
            headers: {'Content-Type': 'application/json'},
            method: 'POST'
        })
        fetchDisplay()
    } catch (error) {
        console.error(error)
        alert('Adding failed. Please read console for error code')
    }

    addName.value = ''
    addPop.value = ''
}

// Sends DELETE request then re-displays cities
async function deleteCity(id) {
    try {
        const response = await fetch(`https://avancera.app/cities/${id}`, { method: 'DELETE' });
        fetchDisplay(); // Refresh the table    
    } catch (error) {
        console.error(error)
        alert('Delete failed. Please read console for error code')
    }
}

fetchDisplay()