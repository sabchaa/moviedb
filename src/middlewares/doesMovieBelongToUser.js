import { getMovieById } from "../db.js"

export const doesMovieBelongToUser = async (req, res, next) => {
  const movie = await getMovieById(req.params.id)
  if (movie.user_id === res.locals.user.id) return next()
  res.redirect("/")
}