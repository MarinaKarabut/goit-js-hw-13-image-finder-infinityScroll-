export default class ApiService {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
    }
    
    fetchArticles() {
        const BASE_URL = 'https://pixabay.com/api';
        const API_KEY = '20930495-600a23973a3be0872b747cdc1';

        const url = `${BASE_URL}/?image_type=photo&orientation=horizontal&q=${this.searchQuery}&page=${this.page}&per_page=12&key=${API_KEY}`
        
        return fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Совпадений не найдено. Введите более детальные критерии")
                }
                return response.json()
            })
            .then(({hits}) => {
                this.incrementPage();
                return hits;
                
            })
            .catch(error => console.log(error))
    }

    incrementPage() {
        this.page += 1
    }

    resetPage() {
        this.page = 1;
    }

    get query() {
        return this.query
    }

    set query(newQuery) {
       this.searchQuery = newQuery
    }
}