document.addEventListener("DOMContentLoaded", () => {
    fetch('output.json')
        .then(response => response.json())
        .then(output => {
            // Sort movies by IMDb rating in descending order
            output.sort((a, b) => b.IMDB_Score - a.IMDB_Score);

            // Select top 10 movies
            const topMovies = output.slice(0, 10);

            const movieGrid = document.getElementById('movieGrid');

            // Function to create and append movie cards
            const createMovieCards = (movies, container) => {
                movies.forEach(movie => {
                    const movieCard = document.createElement('div');
                    movieCard.classList.add('movie-card');

                    movieCard.innerHTML = `
                        <div class="poster-container">
                            <a href="${movie.IMDB_Link}" target="_blank">
                                <img src="${movie.Poster}" alt="${movie.Title} Poster">
                            </a>
                        </div>
                        <div class="movie-info">
                            <div class="cent">
                                <div class="movie-title">${movie.Title}</div>
                                <div class="movie-genre">Genre: ${movie.Genre}</div>
                                <div class="movie-rating">IMDb Rating: ${movie.IMDB_Score}</div>
                            </div>
                        </div>
                    `;

                    container.appendChild(movieCard);
                });
            };

            // Create and append movie cards for top movies
            createMovieCards(topMovies, movieGrid);
        })
        .catch(error => console.error('Error fetching the movie data:', error));
});
