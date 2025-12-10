// import installed packages
const dotenv = require('dotenv')
dotenv.config() // read variables from .env file

const express = require('express')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const morgan = require('morgan')
const session = require('express-session')

// import custom middleware
const isSignedIn = require('./middleware/is-signed-in.js') // checks if user is logged in
const passUserToView = require('./middleware/pass-user-to-view.js') // makes user available in views

// import routes
const authController = require('./controllers/auth.js') // routes for authentication
const applicationsController = require('./controllers/applications.js') // routes for applications

const app = express() // create an express app
const port = process.env.PORT ? process.env.PORT : '3000' // choose port from env or default to 3000

// database connection
mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`)
})

// Use the middleware that was imported
app.use(express.urlencoded({ extended: false })) // parse form data
app.use(methodOverride('_method')) // allow PUT/DELETE requests
app.use(morgan('dev')) // console log incoming requests

app.use(
    session({
        secret: process.env.SESSION_SECRET, // secret for signing session ID
        resave: false, // don't resave unchanged sessions
        saveUninitialized: true, // save new sessions
    })
)

app.use(passUserToView) // pass the user information to all views

// routes
app.get('/', (req, res) => {
    // homepage route
    if (req.session.user) {
        // if user is logged in
        res.redirect(`/users/${req.session.user._id}/applications`) // send them to their apps page
    } else {
        res.render('index.ejs') // otherwise show landing page
    }
})

app.use('/auth', authController) // use auth routes
app.use(isSignedIn) // routes below this line require a user to be signed in

app.use('/users/:userId/applications', applicationsController) // use applications routes

// start the server
app.listen(port, () => {
    console.log(`The express app is ready on port ${port}!`)
})
