module.exports = {
    authUser: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next()
        }

        req.flash('error_msg', 'Você precisa estar logado para acessar esta área.')
        res.redirect('/explore')
    }
}

