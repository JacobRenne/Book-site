Vue.createApp({
    created() {
        this.fetchCities()
    },
    data() {
        return { cities: null, currentEdit: null, addCity: {}}
    },

    methods: {
        async fetchCities() {
            try {
                response = await fetch('https://avancera.app/cities/')
                this.cities = await response.json()
            } catch (error) {
                console.error(error)
                alert('Fetch failed. Consult console for error code')
            } 
        },
        editCity(id, name, pop) {
            this.currentEdit = { 
                id: id,
                name: name,
                population: pop 
            }
        },
        async deleteCity(id) {
            try {
                await fetch(`https://avancera.app/cities/${id}`, { method: 'DELETE' })
                this.fetchCities()
            } catch (error) {
                console.error(error)
                alert('Delete fetch failed. Consult console for error code')
            }
        },
        async addCityFunc(event) {
            event.preventDefault()
            console.log(this.addCity.name)
            
            if (
                this.addCity.name === undefined || this.addCity.population === undefined ||
                this.addCity.name === '' || this.addCity.population === ''
            ) {
                alert('Please fill in the form')
                return
            }

            await fetch(`https://avancera.app/cities/`, {
                body: JSON.stringify({ name: this.addCity.name, population: this.addCity.population }),
                headers: {'Content-Type': 'application/json'},
                method: 'POST'
            })

            this.fetchCities()
        },
        async sendEdit(event) {
            event.preventDefault()

            let check = this.checkForDuplicates()

            if (check === 'duplicate') {
                alert('No duplicate city names!')
                return
            }

            if (check === 'unique') {
                try {   
                    await fetch(`https://avancera.app/cities/${this.currentEdit.id}`, {
                        body: JSON.stringify({ name: this.currentEdit.name, population: this.currentEdit.population }),
                        headers: {'Content-Type': 'application/json'},
                        method: 'PATCH'
                    })
                } catch (error) {
                    console.error(error)
                    alert('Edit fetch failed. Consult console for error code')
                }
            }
            else if (check === 'current') {
                try {
                    await fetch(`https://avancera.app/cities/${this.currentEdit.id}`, {
                        body: JSON.stringify({ population: this.currentEdit.population }),
                        headers: {'Content-Type': 'application/json'},
                        method: 'PATCH'
                    })
                } catch (error) {
                    console.error(error) 
                    alert('Edit fetch failed. Consule console for error code')
                }
            }

            this.fetchCities()
        },
        checkForDuplicates() {
            for (let i = 0; i < Object.keys(this.cities).length; i++) {
                if (this.cities[i].name === this.currentEdit.name){
                    if (this.cities[i].id != this.currentEdit.id) {
                        return 'duplicate'
                    }

                    return 'current'
                }
            }
            return 'unique'
        }
    },

    templates: `
    
    `,

}).mount('#app')