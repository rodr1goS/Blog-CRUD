const express = require('express')
const router = express.Router()

// Controllers
const categoriesController = require('../controllers/adminControllers/categoriesController')
const postsController = require('../controllers/adminControllers/postsController')
const usersController = require('../controllers/adminControllers/usersController')

const { authAdmin } = require('../helpers/authAdmin')

router.get('/', authAdmin, async (req, res) => {
    const UserDb = require('../models/User')
    const PostDb = require('../models/Post')
    const CategoryDb = require('../models/Category')
    
    try {
        const countData = {
            posts: await PostDb.count(),
            users: await UserDb.count(),
            categories: await CategoryDb.count()
        }
    
        res.render('admin/home', {
            title: 'Administration',
            style: 'admin/panel',
            data: countData
        })
    } catch(e) {
        res.render('admin/home', {
            title: 'Administration',
            style: 'admin/panel'
        })
    }
})

// Category area
router.get('/categories', authAdmin, categoriesController.getCategories)
router.get('/categories/add', authAdmin, categoriesController.getAddCategory)
router.post('/categories/add', authAdmin, categoriesController.addCategory)
router.get('/categories/edit/:id', authAdmin, categoriesController.getEditCategory)
router.post('/categories/edit/', authAdmin, categoriesController.editCategory)
router.get('/categories/delete/:id/:slug', authAdmin, categoriesController.deleteCategory)

// Post area
router.get('/posts', authAdmin, postsController.getPosts)
router.post('/posts/search/', authAdmin, postsController.postSearch)
router.get('/posts/delete/:id', authAdmin, postsController.deletePost)
router.get('/posts/edit/:id', authAdmin, postsController.getEditPost)
router.post('/posts/edit/', authAdmin, postsController.editPost)

// User management
router.get('/users', authAdmin, usersController.getUsers)
router.get('/users/delete/:id', authAdmin, usersController.deleteUser)

module.exports = router;
