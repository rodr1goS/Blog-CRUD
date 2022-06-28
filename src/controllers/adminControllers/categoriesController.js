const PostDb = require('../../models/Post')
const CategoryDb = require('../../models/Category')

const categoryAnalyze = require('../../helpers/simpleDataAnalyze').category

const getCategories = (async (req, res) => {
    try {
        const categories = await CategoryDb.findAll({
            order: [['updatedAt', 'DESC']]
        })

        if (categories) {
            res.render('admin/categories', {
                title: 'Categorias',
                style: 'admin/categories',
                categories: categories
            })

            return
        }

        throw new Error('Falha ao carregar categorias')

    } catch(e) {
        req.flash('error_msg', 'Falha ao carregar categorias')
        res.render('admin/categories', {
            title: 'Categorias',
            style: 'admin/categories'
        })
    }
})

const getAddCategory = ((req, res) => {
    res.render('admin/category', {
        title: 'Criando categoria',
        style: 'admin/category'
    })
})

const addCategory = (async (req, res) => {
    try {
        const errors = []
        const category = {
            name: req.body.categoryName,
            slug: req.body.slug
        }
        
        categoryAnalyze({
            data: category,
            errorArray: errors
        })
        
        if (errors.length == 0) {
            CategoryDb.create({ name: category.name, slug: category.slug })
        
            req.flash('success_msg', 'Categoria criado com sucesso')
            res.redirect('/admin/categories')
            return
        }
        
        res.status(500).render('admin/category', {
            title: 'Erro ao adicionar categoria',
            style: 'admin/category',
            errors: errors
        })
    } catch(e) {
        req.flash('error_msg', 'Erro ao criar categoria')
        res.redirect('/admin/categories/add')
    }
})

const getEditCategory = (async (req, res) => {
    try {
        const category = await CategoryDb.findOne({where: { 'id': req.params.id }})

        if (!category) {
            req.flash('error_msg', 'Categoria não encontrada')
            res.redirect('/admin/categories')
            return
        }

        res.status(200).render('admin/editForms/category', {
            title: 'Criando categoria',
            style: 'admin/category',
            category: category
        })
    } catch(e) {
        req.flash('error_msg', 'Erro ao listar categoria')
        res.redirect('/admin/categories/')
    }
})

const editCategory = (async (req, res) => {
    try {
        const errors = []
        const rawData = {
            name: req.body.categoryName,
            slug: req.body.slug,
            id: req.body.categoryId
        }
        
        categoryAnalyze({
            data: rawData,
            errorArray: errors
        })
        
        const category = await CategoryDb.findOne({where: { 'id': rawData.id }})
        
        if (errors.length == 0 && category) {
            CategoryDb.update({
                name: rawData.name,
                slug: rawData.slug
            }, {where: { 'id': rawData.id }})
            
            req.flash('success_msg', 'Categoria atualizada com sucesso')
            res.redirect('/admin/categories')
            return
        }
        
        res.status(500).render('admin/editForms/category', {
            title: 'Erro ao adicionar categoria',
            style: 'admin/category',
            category: category,
            errors: errors
        })
    } catch(e) {
        req.flash('error_msg', 'Erro ao listar categoria')
        res.redirect('/admin/categories')
    }
})

const deleteCategory = (async (req, res) => {
    try {
        const category = await CategoryDb.destroy({where: { 'id': req.params.id }})

        if (!category) {
            req.flash('error_msg', 'Esta categoria não existe')
            res.redirect('/admin/categories')
            return
        }

        PostDb.update({
            category: 'Não categorizado',
            slug: 'naocategorizado'
        }, { where: { 'slug': req.params.slug } })

        req.flash('success_msg', 'Categoria excluída com sucesso')
        res.redirect('/admin/categories')
    } catch(e) {
        req.flash('error_msg', 'Erro ao deletar categoria')
        res.redirect('/admin/categories')
    }
})

module.exports = {
    getCategories,
    getAddCategory,
    addCategory,
    getEditCategory,
    editCategory,
    deleteCategory
}
