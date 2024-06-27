import knex from "knex"
import knexfile from "../knexfile.js"

const env = process.env.NODE_ENV ?? "development"

export const db = knex(knexfile[env])

export const getAllMovies = async (req, res) => {
  const userId = res.locals.user ? res.locals.user.id : null;
  const movies = await db('movies').select('*');
  const watchlist = userId ? await db('watchlist').where('user_id', userId).pluck('movie_id') : [];

  const moviesWithWatchlistInfo = movies.map(movie => ({
      ...movie,
      inWatchlist: watchlist.includes(movie.id)
  }));

  return {
    movies: moviesWithWatchlistInfo,
    userId
  };
};

export const getMovieById = async (id) => {
    const movie = await db("movies").select("*").where("id", id).first()
  
    return movie
}