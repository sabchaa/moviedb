import { db } from "../db.js"
import { Router } from "express"

export const moviesRouter = new Router()

moviesRouter.post('/add', async (req, res) => {
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
  
  moviesRouter.get('/addMovie', (req, res) => {
    if (!res.locals.user) {
      return res.redirect('/login');
    }
    res.render('addMovie', {
      title: 'Add Movie',
    });
  });
  
  moviesRouter.get('/movie/:id', async (req, res) => {
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
  
  moviesRouter.get('/edit/:id', async (req, res) => {
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
  
  moviesRouter.post('/update/:id', async (req, res, next) => {
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
  
  moviesRouter.get('/delete/:id', async (req, res) => {
    const movieId = Number(req.params.id)
    const movie = await db('movies').select('*').where('id', movieId).first()
  
    if (!movie) {
      return res.status(404).send('Movie not found');
    }
    
    await db('movies').delete().where('id', movieId)
  
    res.redirect('/')
  })
  