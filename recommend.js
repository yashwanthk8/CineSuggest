// script.js
// Movie recommendation using TasteDive API
// You'll need to replace this with your own API key from https://tastedive.com/account/api_access
const tastediveApiKey = '1049209-moviesug-88D0E514'; // Replace with your actual API key

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

  // Get seed movies based on genre and mood
  let seedMovies = getSeedMovies(genre, mood, industry);
  console.log('Seed movies:', seedMovies);

  try {
    // Use seed movie to get recommendations
    const seed = seedMovies[0]; // Take the first seed movie
    
    // Construct TasteDive API URL with CORS proxy
    const corsProxy = 'https://cors-anywhere.herokuapp.com/';
    const requestUrl = `${corsProxy}https://tastedive.com/api/similar?q=${encodeURIComponent(seed)}&type=movies&info=1&limit=10&k=${tastediveApiKey}`;
    
    console.log('Making API request with seed movie:', seed);
    
    const response = await fetch(requestUrl);
    
    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API response received:', data);

    if (data && data.Similar && data.Similar.Results) {
      displayMovies(data.Similar.Results);
    } else {
      moviesContainer.innerHTML = '<p>No recommendations found. Please try with different selections.</p>';
    }
  } catch (error) {
    console.error('Error fetching movie data:', error);
    moviesContainer.innerHTML = `<p>Error fetching movie recommendations: ${error.message}</p>
                               <p>Please try again later.</p>
                               <p>If you're seeing a CORS error, please visit 
                               <a href="https://cors-anywhere.herokuapp.com/corsdemo" target="_blank">this link</a> 
                               and request temporary access to the demo server.</p>`;
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

    // Get a placeholder image URL based on movie name
    const imageUrl = `https://via.placeholder.com/300x450?text=${encodeURIComponent(movie.Name)}`;

    // Get YouTube trailer if available
    const youtubeLink = movie.yUrl ? 
      `<a href="${movie.yUrl}" target="_blank" class="watch-trailer">Watch Trailer</a>` : '';

    movieElement.innerHTML = `
      <img src="${imageUrl}" alt="${movie.Name}">
      <h3>${movie.Name}</h3>
      <p class="movie-type">${movie.Type}</p>
      <p class="movie-description">${movie.wTeaser.substring(0, 150)}...</p>
      ${youtubeLink}
    `;

    moviesContainer.appendChild(movieElement);
  });
}

// Get seed movies based on genre, mood, and industry
function getSeedMovies(genre, mood, industry) {
  // Basic mapping of genres and moods to popular movies
  const seedMovieMap = {
    hollywood: {
      '28': { // Action
        happy: ['The Avengers', 'Fast and Furious'],
        sad: ['The Dark Knight', 'Gladiator'],
        excited: ['Mission Impossible', 'John Wick'],
        relaxed: ['Ocean\'s Eleven', 'Men in Black']
      },
      '35': { // Comedy
        happy: ['The Hangover', 'Superbad'],
        sad: ['Little Miss Sunshine', 'The Truman Show'],
        excited: ['Deadpool', '21 Jump Street'],
        relaxed: ['Ferris Bueller\'s Day Off', 'Dumb and Dumber']
      },
      '18': { // Drama
        happy: ['The Pursuit of Happyness', 'Good Will Hunting'],
        sad: ['The Shawshank Redemption', 'Schindler\'s List'],
        excited: ['The Wolf of Wall Street', 'Fight Club'],
        relaxed: ['Forrest Gump', 'The Curious Case of Benjamin Button']
      },
      '27': { // Horror
        happy: ['Ghostbusters', 'The Cabin in the Woods'],
        sad: ['The Sixth Sense', 'The Others'],
        excited: ['A Quiet Place', 'Get Out'],
        relaxed: ['The Mist', 'Crimson Peak']
      }
    },
    bollywood: {
      '28': { // Action
        happy: ['Dhoom', 'Tiger Zinda Hai'],
        sad: ['Agneepath', 'Gangs of Wasseypur'],
        excited: ['War', 'Bang Bang'],
        relaxed: ['Don', 'Race']
      },
      '35': { // Comedy
        happy: ['3 Idiots', 'Golmaal'],
        sad: ['Jane Bhi Do Yaaro', 'Udaan'],
        excited: ['Delhi Belly', 'Andhadhun'],
        relaxed: ['Hera Pheri', 'Welcome']
      },
      '18': { // Drama
        happy: ['Taare Zameen Par', 'Queen'],
        sad: ['Black', 'Devdas'],
        excited: ['Gully Boy', 'Lagaan'],
        relaxed: ['Zindagi Na Milegi Dobara', 'Wake Up Sid']
      },
      '27': { // Horror
        happy: ['Stree', 'Go Goa Gone'],
        sad: ['Raat', 'Bhoot'],
        excited: ['Tumbbad', 'Pari'],
        relaxed: ['13B', 'Ek Thi Daayan']
      }
    },
    tollywood: {
      '28': { // Action
        happy: ['Baahubali', 'RRR'],
        sad: ['KGF', 'Pushpa'],
        excited: ['Saaho', 'Singham'],
        relaxed: ['Magadheera', 'Eega']
      },
      '35': { // Comedy
        happy: ['Jathi Ratnalu', 'F2'],
        sad: ['C/o Kancharapalem', 'Awe'],
        excited: ['Ala Vaikunthapurramuloo', 'Bhale Bhale Magadivoy'],
        relaxed: ['Pelli Choopulu', 'Agent Sai Srinivasa Athreya']
      },
      '18': { // Drama
        happy: ['Mahanati', 'Jersey'],
        sad: ['Arjun Reddy', 'Rangasthalam'],
        excited: ['Bheeshma', 'Dear Comrade'],
        relaxed: ['Majili', 'Fida']
      },
      '27': { // Horror
        happy: ['Prema Katha Chitram', 'Anando Brahma'],
        sad: ['Arundhati', 'Gruham'],
        excited: ['Raju Gari Gadhi', 'Kanchana'],
        relaxed: ['Geetanjali', 'Maya']
      }
    }
  };

  // Return seed movies for the selected combination
  if (seedMovieMap[industry] && 
      seedMovieMap[industry][genre] && 
      seedMovieMap[industry][genre][mood]) {
    return seedMovieMap[industry][genre][mood];
  }
  
  // Fallback movies if combination not found
  return ['The Godfather', 'Inception', 'Avatar', 'Titanic', 'The Matrix'];
}
