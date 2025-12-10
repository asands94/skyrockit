const isSignedIn = (req, res, next) => {
    // req.session.user is the currently logged in user
    if (req.session.user) return next()
    res.redirect('/auth/sign-in')
}

module.exports = isSignedIn
