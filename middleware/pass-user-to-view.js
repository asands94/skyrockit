const passUserToView = (req, res, next) => {
    // res.locals.user creates a variable called user that can be used throughout the app
    // the user variable will either be the logged in user information or null if no user logged in
    res.locals.user = req.session.user ? req.session.user : null
    next()
}

module.exports = passUserToView
