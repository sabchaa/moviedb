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

  movies.push({
    id: id++,
    title,
    director,
    year,
  });

  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});