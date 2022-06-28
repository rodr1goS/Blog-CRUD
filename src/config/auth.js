const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const User = require('../models/User')

module.exports = function(passport) {
    passport.use(new localStrategy({usernameField: 'email', passwordField: 'userPassword'}, (email, password, done) => {
        User.findOne({where: {'email': email}}).then((user) => {
            if (!user) {
                return done(null, false, {message: 'Esta conta não existe!'})
            }

            bcrypt.compare(password, user.password, (error, success) => {
                if (success) {
                    return done(null, user)
                } else {
                    return done(null, false, {message: 'Senha incorreta!'})
                }
            })
        })
    }))

    passport.serializeUser((user, done) => {
        done(null, user)
    })

    passport.deserializeUser((id, done) => {
        done(null, id)
    })
}
