const { authUser } = require('../helpers/authUser')
const PostDb = require('../models/Post')

const getExplore = (async (req, res) => {
    try {
        const posts = await PostDb.findAll({order: [['updatedAt', 'desc']]})

        res.render('home/explore', {
            posts: posts,
            title: 'Explorer',
            style: 'home/explore',
            exploreTitle: 'Postagens feitas pela comunidade.',
        })

    } catch(e) {
        res.render('home/explore', {
            title: 'Explorer',
            style: 'home/explore',
            exploreTitle: 'Postagens feitas pela comunidade.'
        })        
    }
})

// Post area
const getPostView = (async (req, res) => {
    try {
        const post = await PostDb.findOne({
            where: { 'id': req.params.id }
        })

        if (!post) {
            req.flash('error_msg', 'Post não encontrado')
            res.redirect('/explore')

            return
        }

        res.render('home/viewPost', {
            title: post.title,
            style: 'home/viewPost',
            post: post
        })

    } catch(e) {
        req.flash('error_msg', 'Erro ao carregar post')
        res.redirect('/explore')
    }
})

const postSearch = (async (req, res) => {
    try {
        const postTitle = req.body.searchTitle
        const searchPosts = await PostDb.findAll({where: {'title': postTitle}, order: [['updatedAt', 'desc']]})
        
        if (searchPosts) {        
            res.render('home/explore', {
                title: `Procurando por ${postTitle}`,
                style: 'home/explore',
                exploreTitle: `Resultados para "${postTitle}"`,
                posts: searchPosts
            })

            return
        }

        res.render('home/explore', {
            title: `Procurando por ${postTitle}`,
            style: 'home/explore',
            exploreTitle: `Resultados para "${postTitle}"`
        })
        
    } catch(e) {
        req.flash('error_msg', `Falha ao listar postagens por ${req.body.postTitle}`)
        res.redirect('/explore')
    }
})

module.exports = {
    getExplore,
    getPostView,
    postSearch
}