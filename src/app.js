const express = require('express')
const session = require('express-session')
const flash = require('connect-flash')
const { engine } = require('express-handlebars')
const bodyParser = require('body-parser')
const path = require('path')

const passport = require('passport')
require('./config/auth')(passport)

const PORT = 3333 // coloque a porta de sua preferência
const app = express()

// Engine and views config
app.engine('hbs', engine({
    defaultLayout : 'main',
    extname : '.hbs'
}))

app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))

// Session config
app.use(session({
    secret: '', // Coloque uma palavra de sua preferência no secret
    resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

// BodyParser config
app.use(bodyParser.urlencoded({ extended : true }))
app.use(bodyParser.json())

// Static files config
app.use(express.static(path.join(__dirname, 'public')))
app.use(require(path.join(__dirname, 'routes/index')))

app.listen(PORT, () => {
    console.log(`Server online at http://localhost:${PORT}/`)
})

