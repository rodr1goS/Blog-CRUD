const PostDb = require('../../models/Post')
const postAnalyze = require('../../helpers/simpleDataAnalyze').post

const getPosts = (async (req, res) => {
    try {
        const posts = await PostDb.findAll({
            order: [['updatedAt', 'DESC']]
        })

        res.status(200).render('admin/posts', {
            title: 'Posts',
            feedTitle: 'Postagens feitas pela comunidade',
            style: 'admin/posts',
            posts: posts
        })
    } catch(e) {
        req.flash('error_msg', 'Falha ao carregar os posts.')
        res.status(200).render('admin/posts', {
            title: 'Posts',
            feedTitle: 'Postagens feitas pela comunidade',
            style: 'admin/posts'
        })
    }
})

const postSearch = (async (req, res) => {
    try {
        const postTitle = req.body.title
        const posts = await PostDb.findAll({where: { 'title': postTitle }})
        
        res.status(200).render('admin/posts', {
            title: 'Resultado para ' + postTitle,
            feedTitle: 'Resultado para ' + postTitle,
            style: 'admin/posts',
            posts: posts
        })
        
    } catch(e) {
        req.flash('error_msg', 'Erro ao tentar listar/buscar postagem')
        res.redirect('/admin/posts')
    }
})

const deletePost = (async (req, res) => {
    try {
        const deletedPost = await PostDb.destroy({where: { 'id': req.params.id }})

        if (!deletedPost) {
            throw new Error('Erro ao tentar deletar post')
        }

        req.flash('success_msg', 'Post deletado com sucesso')
        res.redirect('/admin/posts')
    } catch(e) {
        req.flash('error_msg', 'Erro ao tentar deletar post')
        res.redirect('/admin')
    }
})

const getEditPost = (async (req, res) => {
    try {
        const post = await PostDb.findOne({where: { 'id': req.params.id }})

        if (!post) {
            req.flash('error_msg', 'Post não encontrado')
            res.redirect('/admin/posts')
            return
        }

        res.render('admin/editForms/post', {
            title: `Editando ${post.title}`,
            style: 'home/form',
            post: post
        })
    } catch(e) {
        req.flash('error_msg', 'Erro ao carregar post')
        res.redirect('/admin/posts')
    }
})

const editPost = (async (req, res) => {
    try {
        const errors = []
        const newData = {
            title: req.body.title,
            description: req.body.description,
            content: req.body.content
        }
        
        postAnalyze({
            data: newData,
            errorArray: errors
        })
        
        if (errors.length > 0) {
            res.status(500).render('admin/editForms/category', {
                title: 'Erro ao adicionar categoria',
                style: 'admin/category',
                category: category,
                errors: errors
            })
        }
        
        const postUpdated = await PostDb.update(newData, {
            where: { 'id': req.body.postId }
        })
        
        req.flash('success_msg', 'Post editado com sucesso')
        res.redirect('/admin/posts/')
    } catch(e) {
        req.flash('error_msg', 'Falha ao editar post')
        res.redirect('/admin/posts/')
    }
})

module.exports = {
    getPosts,
    postSearch,
    deletePost,
    getEditPost,
    editPost
}