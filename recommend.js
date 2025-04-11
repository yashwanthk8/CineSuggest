// script.js
// Local movie recommendation system with no external API dependencies
// This eliminates all CORS and API key issues

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

// Main movie database - this replaces the need for external APIs
const movieDatabase = {
  // Action movies
  'The Avengers': {
    title: 'The Avengers',
    year: 2012,
    genre: 'Action, Adventure, Sci-Fi',
    rating: 8.0,
    description: 'Earth\'s mightiest heroes must come together and learn to fight as a team if they are going to stop the mischievous Loki and his alien army from enslaving humanity.',
    similar: ['Iron Man', 'Captain America', 'Thor', 'Guardians of the Galaxy', 'Black Panther', 'Wonder Woman', 'Justice League']
  },
  'Fast and Furious': {
    title: 'Fast and Furious',
    year: 2009,
    genre: 'Action, Crime, Thriller',
    rating: 6.6,
    description: 'Brian O\'Conner, back working for the FBI in Los Angeles, teams up with Dominic Toretto to bring down a heroin importer by infiltrating his operation.',
    similar: ['Need for Speed', 'The Italian Job', 'Gone in 60 Seconds', 'The Transporter', 'Rush', 'Baby Driver']
  },
  'The Dark Knight': {
    title: 'The Dark Knight',
    year: 2008,
    genre: 'Action, Crime, Drama',
    rating: 9.0,
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    similar: ['Batman Begins', 'The Dark Knight Rises', 'Inception', 'Joker', 'Logan', 'V for Vendetta']
  },
  'Gladiator': {
    title: 'Gladiator',
    year: 2000,
    genre: 'Action, Adventure, Drama',
    rating: 8.5,
    description: 'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.',
    similar: ['Braveheart', 'Troy', '300', 'Kingdom of Heaven', 'The Last Samurai', 'Spartacus']
  },
  'Mission Impossible': {
    title: 'Mission Impossible',
    year: 1996,
    genre: 'Action, Adventure, Thriller',
    rating: 7.1,
    description: 'An American agent, under false suspicion of disloyalty, must discover and expose the real spy without the help of his organization.',
    similar: ['James Bond', 'The Bourne Identity', 'Jack Reacher', 'John Wick', 'Kingsman', 'Salt']
  },
  'John Wick': {
    title: 'John Wick',
    year: 2014,
    genre: 'Action, Crime, Thriller',
    rating: 7.4,
    description: 'An ex-hit-man comes out of retirement to track down the gangsters that killed his dog and took everything from him.',
    similar: ['Atomic Blonde', 'The Equalizer', 'Nobody', 'Extraction', 'The Accountant', 'Taken']
  },
  'Ocean\'s Eleven': {
    title: 'Ocean\'s Eleven',
    year: 2001,
    genre: 'Crime, Thriller',
    rating: 7.7,
    description: 'Danny Ocean and his ten accomplices plan to rob three Las Vegas casinos simultaneously.',
    similar: ['Ocean\'s Twelve', 'Ocean\'s Thirteen', 'The Italian Job', 'Now You See Me', 'Logan Lucky', 'Heat']
  },
  'Men in Black': {
    title: 'Men in Black',
    year: 1997,
    genre: 'Action, Adventure, Comedy',
    rating: 7.3,
    description: 'A police officer joins a secret organization that polices and monitors extraterrestrial interactions on Earth.',
    similar: ['Men in Black II', 'Ghostbusters', 'The Fifth Element', 'Independence Day', 'Galaxy Quest', 'Evolution']
  },
  
  // Comedy movies
  'The Hangover': {
    title: 'The Hangover',
    year: 2009,
    genre: 'Comedy',
    rating: 7.7,
    description: 'Three buddies wake up from a bachelor party in Las Vegas, with no memory of the previous night and the bachelor missing.',
    similar: ['Bridesmaids', 'Superbad', 'The 40-Year-Old Virgin', 'Wedding Crashers', 'Knocked Up', 'Old School']
  },
  'Superbad': {
    title: 'Superbad',
    year: 2007,
    genre: 'Comedy',
    rating: 7.6,
    description: 'Two co-dependent high school seniors are forced to deal with separation anxiety after their plan to stage a booze-soaked party goes awry.',
    similar: ['Knocked Up', 'Pineapple Express', 'American Pie', 'The 40-Year-Old Virgin', 'Step Brothers', '21 Jump Street']
  },
  'Little Miss Sunshine': {
    title: 'Little Miss Sunshine',
    year: 2006,
    genre: 'Comedy, Drama',
    rating: 7.8,
    description: 'A family determined to get their young daughter into the finals of a beauty pageant take a cross-country trip in their VW bus.',
    similar: ['Juno', 'The Royal Tenenbaums', 'Silver Linings Playbook', 'The Kids Are All Right', 'The Way Way Back', 'Sideways']
  },
  'The Truman Show': {
    title: 'The Truman Show',
    year: 1998,
    genre: 'Comedy, Drama, Sci-Fi',
    rating: 8.1,
    description: 'An insurance salesman discovers his whole life is actually a reality TV show.',
    similar: ['Eternal Sunshine of the Spotless Mind', 'The Matrix', 'Being John Malkovich', 'Her', 'Stranger Than Fiction', 'EdTV']
  },
  'Deadpool': {
    title: 'Deadpool',
    year: 2016,
    genre: 'Action, Adventure, Comedy',
    rating: 8.0,
    description: 'A wisecracking mercenary gets experimented on and becomes immortal but ugly, and sets out to track down the man who ruined his looks.',
    similar: ['Deadpool 2', 'Kick-Ass', 'Guardians of the Galaxy', 'Logan', 'The Suicide Squad', 'Shazam!']
  },

  // Drama movies
  'The Shawshank Redemption': {
    title: 'The Shawshank Redemption',
    year: 1994,
    genre: 'Drama',
    rating: 9.3,
    description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    similar: ['The Green Mile', 'The Godfather', 'Schindler\'s List', 'Forrest Gump', 'The Pursuit of Happyness', 'Saving Private Ryan']
  },
  'Forrest Gump': {
    title: 'Forrest Gump',
    year: 1994,
    genre: 'Drama, Romance',
    rating: 8.8,
    description: 'The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75.',
    similar: ['The Curious Case of Benjamin Button', 'Big Fish', 'Saving Private Ryan', 'Cast Away', 'Rain Man', 'Good Will Hunting']
  },
  
  // Bollywood movies
  'Dhoom': {
    title: 'Dhoom',
    year: 2004,
    genre: 'Action, Crime, Thriller',
    rating: 6.7,
    description: 'A motorbike gang is committing robberies all over Mumbai. ACP Jai Dixit teams up with Ali to catch them.',
    similar: ['Dhoom 2', 'Race', 'Don', 'Krrish', 'Bang Bang', 'War']
  },
  '3 Idiots': {
    title: '3 Idiots',
    year: 2009,
    genre: 'Comedy, Drama',
    rating: 8.4,
    description: 'Two friends are searching for their long lost companion. They revisit their college days and recall the memories of their friend who inspired them to think differently.',
    similar: ['Munna Bhai M.B.B.S.', 'Zindagi Na Milegi Dobara', 'PK', 'Taare Zameen Par', 'Dil Chahta Hai', 'Rang De Basanti']
  },
  
  // Tollywood movies
  'Baahubali': {
    title: 'Baahubali: The Beginning',
    year: 2015,
    genre: 'Action, Drama',
    rating: 8.1,
    description: 'In ancient India, an adventurous and daring man becomes involved in a decades-old feud between warring cousins.',
    similar: ['Baahubali 2: The Conclusion', 'RRR', 'KGF', 'Magadheera', 'Eega', 'Arjun Reddy']
  },
  'RRR': {
    title: 'RRR',
    year: 2022,
    genre: 'Action, Drama',
    rating: 7.9,
    description: 'A fictional story about two legendary revolutionaries and their journey away from home before they started fighting for their country in the 1920s.',
    similar: ['Baahubali', 'KGF', 'Pushpa', 'Rangasthalam', 'Magadheera', 'Arjun Reddy']
  }
};

// Function to get movie recommendations
function getMovieRecommendations() {
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
  moviesContainer.innerHTML = '<p>Finding your perfect movie matches...</p>';

  // Get seed movies based on genre and mood
  let seedMovies = getSeedMovies(genre, mood, industry);
  console.log('Seed movies:', seedMovies);

  // Get recommendations based on the seed movies
  const recommendations = getRecommendationsFromSeed(seedMovies[0], 6);
  console.log('Generated recommendations:', recommendations);
  
  // Display the recommendations
  displayMovies(recommendations);
}

// Get recommendations based on a seed movie
function getRecommendationsFromSeed(seedMovie, count = 5) {
  const recommendations = [];
  
  // If the seed movie exists in our database
  if (movieDatabase[seedMovie] && movieDatabase[seedMovie].similar) {
    // Add the seed movie to recommendations
    recommendations.push({
      title: movieDatabase[seedMovie].title,
      year: movieDatabase[seedMovie].year,
      genre: movieDatabase[seedMovie].genre,
      rating: movieDatabase[seedMovie].rating,
      description: movieDatabase[seedMovie].description
    });
    
    // Add similar movies from our database
    movieDatabase[seedMovie].similar.forEach(similarMovie => {
      if (movieDatabase[similarMovie] && recommendations.length < count) {
        recommendations.push({
          title: movieDatabase[similarMovie].title,
          year: movieDatabase[similarMovie].year,
          genre: movieDatabase[similarMovie].genre,
          rating: movieDatabase[similarMovie].rating,
          description: movieDatabase[similarMovie].description
        });
      }
    });
  }
  
  // If we don't have enough recommendations, add some popular movies
  const popularMovies = ['The Avengers', 'The Shawshank Redemption', '3 Idiots', 'RRR', 'The Dark Knight'];
  let i = 0;
  while (recommendations.length < count && i < popularMovies.length) {
    const movie = popularMovies[i];
    if (movieDatabase[movie] && !recommendations.some(r => r.title === movieDatabase[movie].title)) {
      recommendations.push({
        title: movieDatabase[movie].title,
        year: movieDatabase[movie].year,
        genre: movieDatabase[movie].genre,
        rating: movieDatabase[movie].rating,
        description: movieDatabase[movie].description
      });
    }
    i++;
  }
  
  return recommendations;
}

// Display movies to the user
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

    // Create a more reliable image URL based on the movie title
    const formattedTitle = encodeURIComponent(movie.title.replace(/\s+/g, '-').toLowerCase());
    const imageUrl = `https://via.placeholder.com/300x450/333/fff?text=${formattedTitle}`;

    // Stars based on rating
    const ratingStars = '★'.repeat(Math.round(movie.rating/2)) + '☆'.repeat(5 - Math.round(movie.rating/2));

    movieElement.innerHTML = `
      <img src="${imageUrl}" alt="${movie.title}">
      <h3>${movie.title}</h3>
      <p class="movie-year">${movie.year}</p>
      <p class="movie-genre">${movie.genre}</p>
      <p class="movie-rating">${ratingStars} (${movie.rating}/10)</p>
      <p class="movie-description">${movie.description.substring(0, 120)}...</p>
      <a href="https://www.google.com/search?q=${encodeURIComponent(movie.title + ' movie')}" target="_blank" class="watch-info">More Info</a>
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
