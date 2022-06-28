const { Op } = require('sequelize')
const UserDb = require('../../models/User')
const PostDb = require('../../models/Post')

const getUsers = (async (req, res) => {
    try {
        const users = await UserDb.findAll({
            where: {'id': { [Op.not] : req.user.id }},
            order: [['updatedAt', 'desc']]
        })

        res.status(200).render('admin/users', {
            title: 'Usuários',
            style: 'admin/users',
            users: users
        })
    } catch(e) {
        req.flash('error_msg', 'Falha ao listar usuários')
        res.status(500).render('admin/users', {
            title: 'Falha ao listar usuários',
            style: 'admin/users',
        })
    }
})

const deleteUser = (async (req, res) => {
    try {
        const userId = req.params.id
        const user =  await UserDb.destroy({
            where: { 'id': userId }
        })

        if (user) {
            PostDb.destroy({
                where: { 'authorId': userId }
            })
            
            req.flash('success_msg', 'Usuário deletado com sucesso')
            res.redirect('/admin/')
            return
        }

        throw new Error('Falha ao deletar usuário')
    } catch(e) {
        req.flash('error_msg', 'Falha ao deletar usuário')
        res.redirect('/admin/users/')
    }
})

module.exports = {
    getUsers,
    deleteUser
}