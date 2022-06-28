const express = require('express')
const router = express.Router()

const homeController = require('../controllers/homeController')

router.get('/', (req, res) => {
    res.render('home/index', {
        title: 'Principal',
        style: 'home/index'
    })
})

router.get('/explore', homeController.getExplore)
router.get('/post/view/:id', homeController.getPostView)
router.post('/post/search/', homeController.postSearch)

module.exports = router
