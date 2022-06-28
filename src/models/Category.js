const db = require('./Database')

const Categorie = db.sequelize.define('categories', {
    id: {
        type: db.Sequelize.UUID,
        defaultValue: db.Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: db.Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: db.Sequelize.STRING,
        allowNull: false
    }
})


Categorie.sync({ force: false }).then(() => {
    console.log('[✓] CategorieDB conectado')
}).catch((error) => {
    console.log('[!] CategorieDB erro: ' + error)
})

module.exports = Categorie
