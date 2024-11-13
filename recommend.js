// script.js
const apiKey = 'f39fa547d02a594fab7f31f0324a6066'; // Replace with your actual TMDb API key
const baseURL = 'https://api.themoviedb.org/3';

document.getElementById('recommendBtn').addEventListener('click', getMovieRecommendations);

async function getMovieRecommendations() {
  const industry = document.getElementById('industry').value;
  const mood = document.getElementById('mood').value;
  const genre = document.getElementById('genre').value;

  if (!industry || !mood || !genre) {
    alert('Please select industry, mood, and genre.');
    return;
  }

  let region = ''; // Empty by default for Hollywood
  if (industry === 'bollywood') {
    region = '&region=IN&with_original_language=hi'; // Bollywood (Hindi)
  } else if (industry === 'tollywood') {
    // Tollywood/South Indian movies: Telugu, Tamil, Kannada, Malayalam languages
    region = '&region=IN&with_original_language=te'; // Telugu, Tamil, Kannada, Malayalam
  }

  try {
    const response = await fetch(`${baseURL}/discover/movie?api_key=${apiKey}&with_genres=${genre}${region}`);
    const data = await response.json();

    displayMovies(data.results);
  } catch (error) {
    console.error('Error fetching movie data:', error);
  }
}

function displayMovies(movies) {
  const moviesContainer = document.getElementById('moviesContainer');
  moviesContainer.innerHTML = '';

  if (movies.length === 0) {
    moviesContainer.innerHTML = '<p>Soon Movies are going to be added.</p>';
    return;
  }

  movies.forEach(movie => {
    const movieElement = document.createElement('div');
    movieElement.classList.add('movie');

    movieElement.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
      <h3>${movie.title}</h3>
      <p>Release Date: ${movie.release_date}</p>
      <p>Rating: ${movie.vote_average}</p>
    `;

    moviesContainer.appendChild(movieElement);
  });
}
