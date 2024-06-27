import express from 'express';
import cookieParser from 'cookie-parser'
import expressEjsLayouts from "express-ejs-layouts"
import { getAllMovies } from "./db.js"
import { moviesRouter } from "./routes/movies.js"
import { usersRouter } from "./routes/users.js"
import { loadUserFromCookie } from "./middlewares/loadUserFromCookie.js"

export const app = express();

app.set("layout", "layouts/layout")
app.set('view engine', 'ejs');

app.use(expressEjsLayouts)

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use(loadUserFromCookie)

app.get('/', async (req, res) => {
    const { movies, userId } = await getAllMovies(req, res);
    res.render('moviesList', {
      title: 'Movies',
      movies,
      userId
    });
});

app.use(moviesRouter)
app.use(usersRouter)

app.use((req, res) => {
    res.status(404)
    res.send("404 - Stránka nenalezena")
})

app.use((err, req, res, next) => {
    console.error(err)
    res.status(500)
    res.send("500 - Chyba na straně serveru")
})
