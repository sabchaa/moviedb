import express from 'express';

const port = 3000;

let id = 1;

const movies = [
  {
    "id": 1,
    "title": "The Shawshank Redemption",
    "director": "Frank Darabont",
    "year": 1994,
    "genre": [
      "Drama",
      "Crime"
    ],
    "rating": 9.3,
    "runtime": 142
  },
  {
    "id": 2,
    "title": "The Godfather",
    "director": "Francis Ford Coppola",
    "year": 1972,
    "genre": [
      "Crime",
      "Drama"  
    ],
    "rating": 9.2,
    "runtime": 175
  },
  {
    "id": 3,
    "title": "The Dark Knight",
    "director": "Christopher Nolan",
    "year": 2008,
    "genre": [
      "Action",
      "Crime",
      "Drama"
    ],
    "rating": 9.0,
    "runtime": 152
  },
  {
    "id": 4,
    "title": "The Lord of the Rings: The Fellowship of the Ring",
    "director": "Peter Jackson",
    "year": 2001,
    "genre": [
      "Adventure",
      "Drama",
      "Fantasy"
    ],
    "rating": 8.8,
    "runtime": 178
  },
  {
    "id": 5,
    "title": "Pulp Fiction",
    "director": "Quentin Tarantino",
    "year": 1994,
    "genre": [
      "Crime",
      "Drama"
    ],
    "rating": 8.9,
    "runtime": 154
  },
  {
    "id": 6,
    "title": "Inception",
    "director": "Christopher Nolan",
    "year": 2010,
    "genre": [
      "Action",
      "Adventure",
      "Sci-Fi"
    ],
    "rating": 8.8,
    "runtime": 148
  },
];

const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Movies!',
    movies,
  });
});

app.post('/add', (req, res) => {
  const title = String(req.body.title);
  const director = String(req.body.director);
  const year = Number(req.body.year);
  const genre = Array.isArray(req.body.genre) ? req.body.genre : [req.body.genre];
  const rating = null;

  movies.push({
    id: id++,
    title,
    director,
    year,
    genre,
    rating
  });

  res.redirect('/');
});

app.get('/addMovie', (req, res) => {
  res.render('addMovie', {
    title: 'Add Movie',
  });
});

app.get('/movie/:id', (req, res) => {
  const movieId = Number(req.params.id);
  const movie = movies.find(m => m.id === movieId);
  if (movie) {
    res.render('movie', {
      title: `${movie.title}`,
      movie,
    });
  } else {
    res.status(404).send('Movie not found');
  }
});

app.get('/edit/:id', (req, res) => {
	const movieId = Number(req.params.id);
  const movie = movies.find(m => m.id === movieId);
  if (movie) {
    res.render('editMovie', {
      title: `${movie.title}`,
      movie,
    });
  } else {
    res.status(404).send('Movie not found');
  }
})

app.post('/update/:id', (req, res) => {
  const movieId = Number(req.params.id);
  const title = String(req.body.title);
  const director = String(req.body.director);
  const year = Number(req.body.year);
  const genre = Array.isArray(req.body.genre) ? req.body.genre : [req.body.genre];

  const movieIndex = movies.findIndex(movie => movie.id === movieId);
  if (movieIndex !== -1) {
    movies[movieIndex] = {
      ...movies[movieIndex],
      title,
      director,
      year,
      genre
    };
  }
  res.redirect(`/movie/${movieId}`);
});

app.get('/delete/:id', (req, res) => {
  const movieId = Number(req.params.id)
  const index = movies.findIndex((m) => m.id === movieId)

  if (index !== -1) {
    movies.splice(index, 1)
  }
  res.redirect('/')
})

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});