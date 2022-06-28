const PostDb = require('../../models/Post')
const User = require('../../models/User')

const userAnalyze = require('../../helpers/simpleDataAnalyze').user
const bcrypt = require('bcryptjs')

const getAccount = (async (req, res) => {
    try {
        const userPosts = await PostDb.findAll({
            where: { 'authorId': req.user.id },
            order: [['updatedAt', 'DESC']]
        })

        res.render('user/account', {
            title: `Bem vindo ${req.user.name}!`,
            style: 'user/account',
            userPosts: userPosts
        })

    } catch(e) {
        res.render('user/account', {
            title: `Bem vindo ${req.user.name}!`,
            style: 'user/account'
        })   
    }      
})

const authAccount = ((req, res) => {
    res.status(201).render('user/confirm', {
        data: req.body,
        type : req.params.type,
        title : req.params.type == 'changes' ? 'Fazendo algumas alterações.' : 'Excluir a conta?',
        authTitle : req.params.type == 'changes' ? 'Deseja atualizar as informações' : 'Deseja excluir sua conta?',
        description : req.params.type == 'changes' ? 'Lembre-se de anotar as alterações, pois não fiz um sistema de recuperar senha ;-;' : 'Está ação é irreversível, pense bem antes de excluir sua conta...', 
        style: 'user/confirm'
    })
})

const deleteAccount = (async (req, res) => {
    try {
        console.log(req.body)
        const user = await User.findOne({
            where: { 'id': req.body.userId }
        })
        
        if (!user) { throw new Error('User não encontrado.') }

        const userPassword = bcrypt.compareSync(req.body.authPassword, req.user.password)

        if (!userPassword) {
            req.flash('error_msg', 'Senha incorreta')
            res.redirect('/user/account')
            return;
        }

        const deletedAccount = await User.destroy({where: { 'id': req.body.userId }})
        const postsByAccount = await PostDb.destroy({where: { 'authorId': req.body.userId }})

        if (deletedAccount == 1 || postsByAccount == 1) {
            req.flash('success_msg', 'Conta deletada com sucesso')
            res.redirect('/user/logout')
        }
    } catch(e) {
        console.log(e)
        req.flash('error_msg', 'Falha ao apagar conta.')
        res.redirect('/user/account')
    }
})

const changesAccount = (async (req, res) => {
    try {
        const user = await User.findOne({
            where: { 'id': req.body.userId }
        })
        
        if (!user) {
            req.flash('error_msg', 'Usuário não encontrado')
            res.redirect('/user/login')
            return
        }

        const userPassword = bcrypt.compareSync(req.body.authPassword, req.user.password)

        if (!userPassword) {
            req.flash('error_msg', 'Senha incorreta')
            res.redirect('/user/account')
            return
        }
        
        var hashPassword = req.user.password
        
        if (req.body.newPassword.length > 5) {
            const salt = bcrypt.genSaltSync(10);
            hashPassword = bcrypt.hashSync(req.body.newPassword, salt);
        }
        
        const updateData = await User.update({
            name: req.body.username || req.user.name,
            email: req.body.email || req.user.email,
            password: hashPassword
        }, {where: { 'id': req.body.userId }})

        if (updateData) {
            req.flash('success_msg', 'Alterações feitas com sucesso, entre novamente')
            res.redirect('/user/logout')
            return
        }
        
        throw new Error('Erro ao atualizar os dados da conta')
    } catch(e) {
        req.flash('error_msg', 'Erro ao atualizar os dados da conta')
        res.redirect('/user/account')
    }
})

const getLogout = ((req, res) => {
    req.logout((err) => {
        if (err) {
            req.flash('error_msg', 'Erro ao deslogar.')
            req.redirect('/')
            return
        }

        req.user = null

        req.flash('success_msg', 'Deslogado com sucesso.')
        res.redirect('/')
    })
})

module.exports = {
    getAccount,
    authAccount,
    deleteAccount,
    changesAccount,
    getLogout
}