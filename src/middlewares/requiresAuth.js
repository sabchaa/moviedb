export const requiresAuth = (req, res, next) => {
    if (res.locals.user) {
      next()
    } else {
      res.redirect("/login")
    }
}