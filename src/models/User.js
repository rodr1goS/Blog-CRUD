const db = require('./Database')

const User = db.sequelize.define('users', {
    id: {
        type: db.Sequelize.UUID,
        defaultValue: db.Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
    },    
    admin: {
        type: db.Sequelize.INTEGER,
        defaultValue: 0
    },
    name: {
        type: db.Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: db.Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: db.Sequelize.STRING,
        allowNull: false
    }
})

User.sync({ force: false }).then(() => {
    console.log('[✓] UserDB conectado!')
}).catch(err => {
    console.log('[!] UserDB erro: ' + err)
})

module.exports = User
