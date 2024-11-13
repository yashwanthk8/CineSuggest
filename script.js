// Define movieData as an array to hold the fetched data
let movieData = [];

// Fetch the JSON data
fetch('output.json')
    .then(response => response.json())
    .then(data => {
        movieData = data;
        initializeFuse();
    })
    .catch(error => console.error('Error fetching the JSON data:', error));

// Initialize Fuse.js for searching movies
let fuse;
function initializeFuse() {
    const options = {
        keys: ['Title'], // Specify the key to search on
        threshold: 0.3 // Set a threshold for search relevance
    };
    fuse = new Fuse(movieData, options); // Initialize Fuse.js with options
}

// Function to search for a movie and display suggestions
function searchMovie(query) {
    const result = fuse.search(query); // Perform the search using Fuse.js

    if (result.length > 0) {
        displaySuggestions(result); // Display search suggestions
    } else {
        document.getElementById('suggestions').innerHTML = '<p>No suggestions found.</p>'; // Handle no results found
    }
}

// Function to display movie details based on selected result
function displayMovieDetails(movie) {
    const movieDetailsDiv = document.getElementById('movie-details');
    movieDetailsDiv.innerHTML = `
        <div class="movie-info">
        <h2>${movie.Title}</h2>
        <div style="text-align: center;">
    <img src="${movie.Poster}" alt="${movie.Title} Poster" style="max-width: 100%;height: auto;">
</div>

            <p><strong>IMDB Score:</strong> ${movie.IMDB_Score}</p>
            <p><strong>Genre:</strong> ${movie.Genre}</p>
            <p><strong>IMDB Link:</strong> <a href="${movie.IMDB_Link}" target="_blank">${movie.IMDB_Link}</a></p>
        </div>
        
    `;
}

// Function to display search suggestions
function displaySuggestions(results) {
    const suggestionsDiv = document.getElementById('suggestions');
    suggestionsDiv.innerHTML = ''; // Clear previous suggestions

    results.forEach(result => {
        const div = document.createElement('div');
        div.textContent = result.item.Title; // Display movie Title in suggestion
        div.addEventListener('click', () => {
            displayMovieDetails(result.item); // Display details when suggestion is clicked
            suggestionsDiv.innerHTML = ''; // Clear suggestions after selection
            document.getElementById('search-bar').value = result.item.Title; // Set search bar value to selected movie Title
        });
        suggestionsDiv.appendChild(div); // Append suggestion to suggestionsDiv
    });
}

// Event listener for the search bar input
document.getElementById('search-bar').addEventListener('input', function () {
    const query = this.value.trim(); // Get input value and trim whitespace

    if (query) {
        searchMovie(query); // Perform search if query is not empty
    } else {
        document.getElementById('suggestions').innerHTML = ''; // Clear suggestions if query is empty
        document.getElementById('movie-details').innerHTML = ''; // Clear movie details if query is empty
    }
});
