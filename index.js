import express from 'express';
import { db, createUser,  getUserByToken, getUser } from './src/db.js'
import cookieParser from 'cookie-parser'

const port = 3000;

const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use(async (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    res.locals.user = await getUserByToken(token);
  } else {
    res.locals.user = null;
  }

  next();
});

app.get('/signup', async (req, res) => {
  res.render('signup')
})

app.post('/signup', async (req, res) => {
  const name = String(req.body.name);
  const password = String(req.body.password);

  const user = await createUser(name, password)

  res.cookie('token', user.token)

  res.redirect('/')
})

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  const name = String(req.body.name);
  const password = String(req.body.password);

  const user = await getUser(name, password);

  if (user) {
    res.cookie('token', user.token);
    res.redirect('/');
  } else {
    res.render('login', { error: 'Invalid username or password' });
  }
});

app.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});

app.get('/', async (req, res) => {
  const movies = await db('movies').select('*')
  res.render('index', {
    title: 'Movies!',
    movies,
  });
});

app.post('/add', async (req, res) => {
  const title = String(req.body.title);
  const img = String(req.body.img);
  const director = String(req.body.director);
  const description = String(req.body.description);
  const year = Number(req.body.year);
  const runtime = Number(req.body.runtime);
  const genre = Array.isArray(req.body.genre) ? req.body.genre.join(', ') : String(req.body.genre);
  const rating = 0;

  await db('movies').insert({
    title,
    img,
    director,
    description,
    year,
    runtime,
    genre,
    rating
  });

  res.redirect('/');
});

app.get('/addMovie', (req, res) => {
  if (!res.locals.user) {
    return res.redirect('/login');
  }
  res.render('addMovie', {
    title: 'Add Movie',
  });
});

app.get('/movie/:id', async (req, res) => {
  const movieId = Number(req.params.id);
  const movie = await db('movies').select('*').where('id', movieId).first()
  
  if (movie) {
    res.render('movie', {
      title: `${movie.title}`,
      movie,
    });
  } else {
    res.status(404).send('Movie not found');
  }
});

app.get('/edit/:id', async (req, res) => {
	const movieId = Number(req.params.id);
  const movie = await db('movies').select('*').where('id', movieId).first();
  if (movie) {
    res.render('editMovie', {
      title: `${movie.title}`,
      movie,
    });
  } else {
    res.status(404).send('Movie not found');
  }
})

app.post('/update/:id', async (req, res, next) => {
  const movieId = Number(req.params.id);
  const title = String(req.body.title);
  const img = String(req.body.img);
  const director = String(req.body.director);
  const description = String(req.body.description);
  const year = Number(req.body.year);
  const runtime = Number(req.body.runtime);
  const genre = Array.isArray(req.body.genre) ? req.body.genre.join(', ') : String(req.body.genre);

  const movie = await db('movies').select('*').where('id', movieId).first();

  if (!movie) {
    return res.status(404).send('Movie not found');
  }

  await db('movies').where('id', movieId).update({
    title,
    img,
    director,
    description,
    year,
    runtime,
    genre,
  });

  res.redirect(`/movie/${movieId}`);
});

app.get('/delete/:id', async (req, res) => {
  const movieId = Number(req.params.id)
  const movie = await db('movies').select('*').where('id', movieId).first()

  if (!movie) {
    return res.status(404).send('Movie not found');
  }
  
  await db('movies').delete().where('id', movieId)

  res.redirect('/')
})

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});