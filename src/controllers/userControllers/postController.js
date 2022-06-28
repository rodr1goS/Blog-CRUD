const CategoryDb = require('../../models/Category')
const PostDb = require('../../models/Post')
const postAnalyze = require('../../helpers/simpleDataAnalyze').post

const getAddPost = (async (req, res) => {
    try {
        const categories = await CategoryDb.findAll({
            order: [['updatedAt', 'DESC']]
        })

        res.status(200).render('user/post', {
            title: 'Post',
            style: 'home/form',
            categories: categories
        })
    } catch(e) {
        req.flash('error_msg', 'Erro ao carregar as categorias.')
        res.status(500).render('user/post', {
            title: 'Post',
            style: 'home/form'
        })
    }
})

const addPost = (async (req, res) => {
    try {
        const post = req.body
        const errors = []
        const hasPost = await PostDb.findOne({
            where: { 'title': post.title }
        })

        if (hasPost) {
            req.flash('error_msg', 'Já existe um post com este título')
            res.redirect('/user/post/add')
            return
        }

        postAnalyze({
            data: post,
            errorArray: errors
        })

        if (errors.length > 0) {
            res.status(401).render('user/post', {
                title: 'Post inválido',
                style: 'home/form',
                errors: errors
            })
            return 
        }

        const category = await CategoryDb.findOne({where: { 'slug' : req.body.slug }})
        
        post.category = category ? category.name : 'Não categorizado'
        post.slug = category ? category.slug : 'naocategorizado'
        post.author = req.user.name
        post.authorId = req.user.id
        PostDb.create(post)

        req.flash('success_msg', 'Post publicado com sucesso.')
        res.redirect('/explore')

    } catch(e) {
        req.flash('error_msg', 'Falha ao publicar post')
        res.redirect('/user/post/add')
    }
})

const deletePost = (async (req, res) => {
    try {
        const deletedPost = await PostDb.destroy({
            where: { 'id': req.params.id }
        })

        if (!deletedPost) {
            throw new Error('Erro ao tentar deletar post')
        }

        req.flash('success_msg', 'Post deletado com sucesso')
        res.redirect('/user/account')
    } catch(e) {
        req.flash('error_msg', 'Erro ao tentar deletar post')
        res.redirect('/user/account')
    }
})

const getEditPost = (async (req, res) => {
    try {
        const post = await PostDb.findOne({
            where: { 'id': req.params.id }
        })

        if (post.authorId != req.user.id || !post) {
            throw new Error('Erro ao carregar postagem')
        }

        res.render('user/editForms/post', {
            title: `Editando ${post.title}`,
            style: 'home/form',
            post: post
        })

    } catch(e) {
        req.flash('error_msg', 'Erro ao carregar postagem')
        res.redirect('/explore')
    }
})

const editPost = (async (req, res) => {
    try {
        const post = req.body
        const errors = []
        const existsPost = await PostDb.findOne({
            where: { 'id': post.id }
        })

        postAnalyze({
            data: post,
            errorArray: errors
        })
        
        if (existsPost.authorId != req.user.id || !existsPost || errors.length > 0) {
            throw new Error('Erro ao editar postagem')
        }
        
        PostDb.update({
            title: post.title,
            description: post.description,
            content: post.content
        }, { where: { 'id': post.id } })

        req.flash('success_msg', 'Post editado com sucesso')
        res.redirect('/user/account')
    } catch(e) {
        req.flash('error_msg', 'Erro ao editar postagem')
        res.redirect('/user/account')
    }
})

module.exports = {
    getAddPost,
    addPost,
    deletePost,
    getEditPost,
    editPost
}