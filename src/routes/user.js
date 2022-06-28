const express = require('express')
const router = express.Router()

const registerController = require('../controllers/userControllers/registerController')
const accountController = require('../controllers/userControllers/accountController')
const postController = require('../controllers/userControllers/postController')

const { authUser } = require('../helpers/authUser')
const passport = require('passport')

router.get('/login', (req, res) => {
    res.status(200).render('user/login', {
        title: 'Sign in',
        style: 'user/loginForm'
    })
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/explore',
        failureRedirect: '/user/login',
        failureFlash: true
    })(req, res, next)
})

router.get('/register', registerController.getRegisterUser)
router.post('/register', registerController.registerUser)

// Account area
router.get('/account', authUser, accountController.getAccount)
router.post('/account/auth/:type', authUser, accountController.authAccount)
router.post('/account/delete', authUser, accountController.deleteAccount)
router.post('/account/changes', authUser, accountController.changesAccount)
router.get('/logout', authUser, accountController.getLogout)

// Post
router.get('/post/add', authUser, postController.getAddPost)
router.post('/post/add', authUser, postController.addPost)
router.get('/post/delete/:id', authUser, postController.deletePost)
router.get('/post/edit/:id', authUser, postController.getEditPost)
router.post('/post/edit/', authUser, postController.editPost)

module.exports = router
