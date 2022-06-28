const User = require('../../models/User')
const bcrypt = require('bcryptjs')
const userAnalyze = require('../../helpers/simpleDataAnalyze').user

const getRegisterUser = ((req, res) => {
    res.status(200).render('user/register', {
        title: 'Sign up',
        style: 'user/loginForm'
    })
})

const registerUser = (async (req, res) => {
    const errors = []
    const user = {
        name: req.body.username,
        email: req.body.email,
        password: req.body.userPassword,
        repassword: req.body.userRepassword
    }

    const usernameHasRegistred = await User.findOne({where: { 'name': user.name }})
    const emailHasRegistred = await User.findOne({where: { 'email': user.email }})

    userAnalyze({
        data: user,
        minLength: 3,
        maxLength: 46,
        errorArray: errors
    })

    if (usernameHasRegistred) {errors.push({ message: 'Nome já está sendo usado! Por favor use outro!' })}
    if (emailHasRegistred) {errors.push({ message: 'Email já foi cadastrado! Por favor use outro!' })}

    if (errors.length <= 0) {
        try {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(user.password, salt);
            user.password = hash
            
            User.create({
                name: user.name,
                email: user.email,
                password: user.password
            })
            
            req.flash('success_msg', 'Usuário cadastrado com sucesso.')
            res.redirect('/user/login')
        } catch(e) {
            req.flash('error_msg', 'Falha ao cadastrar novo usuário.')
            res.redirect('/use/register')
        }
        return
    }
    
    res.status(500).render('user/register', {
        title: 'Register',
        style: 'user/loginForm',
        errors: errors
    })
})

module.exports = {
    getRegisterUser,
    registerUser
}