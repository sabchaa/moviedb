import { Router } from "express"
import { createUser, getUser } from "../users.js"

export const usersRouter = new Router()

usersRouter.get('/signup', async (req, res) => {
    res.render('signup', {
        title: 'Sign up',
      });
})
  
usersRouter.post('/signup', async (req, res) => {
    const name = String(req.body.name);
    const password = String(req.body.password);

    const user = await createUser(name, password)
    if (!user) {
        return res.redirect("/signup")
    }
    res.cookie('token', user.token)
    res.redirect('/')
})
  
usersRouter.get('/login', (req, res) => {
    res.render('login', {
        title: 'Log in',
    });
});
  
usersRouter.post('/login', async (req, res) => {
    const name = String(req.body.name);
    const password = String(req.body.password);
  
    const user = await getUser(name, password);
    if (!user) return res.redirect("/login")
  
    res.cookie('token', user.token);
    res.redirect('/');
});
  
usersRouter.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});
