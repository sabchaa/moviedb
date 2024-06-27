import { db } from "../db.js"
import { Router } from "express"
import { requiresAuth } from "../middlewares/requiresAuth.js"
import { doesMovieBelongToUser } from "../middlewares/doesMovieBelongToUser.js"
import { updateMovieRating } from "../reviews.js"

export const moviesRouter = new Router()

moviesRouter.post('/add', async (req, res) => {
    const userId = res.locals.user.id;
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
      rating,
      user_id: userId
    });
  
    res.redirect('/');
  });
  
  moviesRouter.get('/addMovie', requiresAuth, (req, res) => {
    res.render('addMovie', {
      title: 'Add Movie',
    });
  });
  
  moviesRouter.get('/movie/:id', async (req, res, next) => {
    const movieId = Number(req.params.id);

    try {
        // Fetch movie details
        const movie = await db('movies').select('*').where('id', movieId).first();

        if (!movie) {
            return res.status(404).send('Movie not found');
        }

        const userId = res.locals.user ? res.locals.user.id : null;

        // Fetch reviews for the movie
        const reviews = await db('reviews')
            .select('reviews.*', 'users.name as user_name')
            .join('users', 'reviews.user_id', 'users.id')
            .where('reviews.movie_id', movieId);

        const inWatchlist = await db('watchlist')
            .where({
                user_id: userId,
                movie_id: movieId
            })
            .first();

        // Check if user has already submitted a review
        const userReview = userId ? await db('reviews')
            .where({
                user_id: userId,
                movie_id: movieId
            })
            .first() : null;

        // Include reviews in the movie object
        movie.reviews = reviews;

        res.render('movieDetail', {
            title: `${movie.title}`,
            movie,
            inWatchlist: !!inWatchlist,
            userId,
            userReview
        });
    } catch (err) {
        console.error('Error fetching movie details:', err);
        next(err);
    }
});
  
  moviesRouter.get('/edit/:id', requiresAuth, doesMovieBelongToUser, async (req, res) => {
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
  
  moviesRouter.get('/delete/:id', requiresAuth, doesMovieBelongToUser, async (req, res) => {
    const movieId = Number(req.params.id)
    const movie = await db('movies').select('*').where('id', movieId).first()
  
    if (!movie) {
      return res.status(404).send('Movie not found');
    }
    
    await db('movies').delete().where('id', movieId)
  
    res.redirect('/')
  })

  moviesRouter.post('/toggleWatchlist/:id', requiresAuth, async (req, res) => {
    const userId = res.locals.user.id;
    const movieId = Number(req.params.id);
    
    // Check if the movie is already in the watchlist
    const watchlistEntry = await db('watchlist')
      .where({
        user_id: userId,
        movie_id: movieId
      })
      .first();
  
    if (watchlistEntry) {
      // If movie is already in watchlist, delete it
      await db('watchlist')
        .where({
          user_id: userId,
          movie_id: movieId
        })
        .delete();
    } else {
      // If movie is not in watchlist, add it
      await db('watchlist').insert({
        user_id: userId,
        movie_id: movieId
      });
    }
  
    res.redirect(req.headers.referer || `/movie/${movieId}`);
  });

  moviesRouter.get('/watchlist', requiresAuth, async (req, res) => {
    const userId = res.locals.user.id;
    const watchlistMovies = await db('movies')
        .join('watchlist', 'movies.id', '=', 'watchlist.movie_id')
        .where('watchlist.user_id', userId)
        .select('movies.*');

    const moviesWithWatchlistInfo = watchlistMovies.map(movie => ({
        ...movie,
        inWatchlist: true
    }));

    res.render('moviesList', {
        title: 'My Watchlist',
        movies: moviesWithWatchlistInfo
    });
});

moviesRouter.get('/myMovies', requiresAuth, async (req, res) => {
    const userId = res.locals.user.id;
    const myMovies = await db('movies').where('user_id', userId).select('*');
    const watchlist = await db('watchlist').where('user_id', userId).pluck('movie_id');

    const moviesWithWatchlistInfo = myMovies.map(movie => ({
        ...movie,
        inWatchlist: watchlist.includes(movie.id)
    }));

    res.render('moviesList', {
        title: 'My Movies',
        movies: moviesWithWatchlistInfo
    });
});

moviesRouter.post('/movie/:id/reviews', requiresAuth, async (req, res, next) => {
  const movieId = Number(req.params.id);
  const { rating, review_text } = req.body;
  const userId = res.locals.user.id;

  try {
      const newReview = await db('reviews').insert({
          movie_id: movieId,
          user_id: userId,
          rating,
          review_text
      }).returning('*');

      await updateMovieRating(db, movieId);
      res.redirect(`/movie/${movieId}`);

  } catch (err) {
      console.error('Error creating review:', err);
      next(err);
  }
});