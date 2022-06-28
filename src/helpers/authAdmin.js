module.exports = {
    authAdmin: (req, res, next) => {
        if (req.isAuthenticated() && req.user.admin == 1) {
            return next()
        }

        req.flash('error_msg', 'Você precisa ser admin para acessar esta área.')
        res.redirect('/explore')
    }
}
