import express from 'express';
import cookieParser from 'cookie-parser'
import { getAllMovies } from "./db.js"
import { moviesRouter } from "./routes/movies.js"
import { usersRouter } from "./routes/users.js"
import { loadUserFromCookie } from "./middlewares/loadUserFromCookie.js"

export const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use(loadUserFromCookie)

app.get('/', async (req, res) => {
    const movies = await getAllMovies()
    res.render('index', {
      title: 'Movies',
      movies,
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
