// script.js
const apiKey = 'f39fa547d02a594fab7f31f0324a6066'; // TMDb API key
const baseURL = 'https://api.themoviedb.org/3';

// Add event listener when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const recommendBtn = document.getElementById('recommendBtn');
  if (recommendBtn) {
    recommendBtn.addEventListener('click', getMovieRecommendations);
    console.log('Recommendation button listener attached');
  } else {
    console.error('recommendBtn element not found');
  }
});

async function getMovieRecommendations() {
  console.log('Get recommendations button clicked');
  
  const industry = document.getElementById('industry').value;
  const mood = document.getElementById('mood').value;
  const genre = document.getElementById('genre').value;

  console.log('Selected options:', { industry, mood, genre });

  if (!industry || !mood || !genre) {
    alert('Please select industry, mood, and genre.');
    return;
  }

  // Show loading indicator
  const moviesContainer = document.getElementById('moviesContainer');
  moviesContainer.innerHTML = '<p>Loading recommendations...</p>';

  let region = ''; // Empty by default for Hollywood
  if (industry === 'bollywood') {
    region = '&region=IN&with_original_language=hi'; // Bollywood (Hindi)
  } else if (industry === 'tollywood') {
    // Tollywood/South Indian movies: Telugu, Tamil, Kannada, Malayalam languages
    region = '&region=IN&with_original_language=te'; // Telugu, Tamil, Kannada, Malayalam
  }

  try {
    const requestUrl = `${baseURL}/discover/movie?api_key=${apiKey}&with_genres=${genre}${region}&include_adult=false&sort_by=popularity.desc`;
    console.log('Making API request to:', requestUrl.replace(apiKey, 'API_KEY_HIDDEN'));
    
    const response = await fetch(requestUrl);
    
    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API response received. Movie count:', data.results?.length);

    displayMovies(data.results);
  } catch (error) {
    console.error('Error fetching movie data:', error);
    const moviesContainer = document.getElementById('moviesContainer');
    moviesContainer.innerHTML = `<p>Error fetching movie recommendations: ${error.message}</p>
                                <p>Please try again later.</p>`;
  }
}

function displayMovies(movies) {
  const moviesContainer = document.getElementById('moviesContainer');
  moviesContainer.innerHTML = '';

  if (!movies || movies.length === 0) {
    moviesContainer.innerHTML = '<p>No movies found for your selection. Please try different criteria.</p>';
    return;
  }

  console.log('Displaying movies:', movies.length);

  movies.forEach(movie => {
    const movieElement = document.createElement('div');
    movieElement.classList.add('movie');

    // Handle missing poster path
    const posterUrl = movie.poster_path 
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : 'https://via.placeholder.com/500x750?text=No+Poster+Available';

    movieElement.innerHTML = `
      <img src="${posterUrl}" alt="${movie.title}" onerror="this.src='https://via.placeholder.com/500x750?text=Image+Error'">
      <h3>${movie.title}</h3>
      <p>Release Date: ${movie.release_date || 'Unknown'}</p>
      <p>Rating: ${movie.vote_average || 'N/A'}</p>
    `;

    moviesContainer.appendChild(movieElement);
  });
}
