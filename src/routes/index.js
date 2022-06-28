const express = require('express')
const router = express.Router()
const path = require('path')

// Routes
const Home = require(path.join(__dirname, '/home'))
const User = require(path.join(__dirname, '/user'))
const Admin = require(path.join(__dirname, '/admin'))

// simple middleware
router.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    res.locals.user = req.user || null;

    next()
})

// Setup routes
router.use('/', Home)
router.use('/user', User)
router.use('/admin', Admin)

module.exports = router;
