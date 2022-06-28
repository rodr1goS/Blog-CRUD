const db = require('./Database')

const Post = db.sequelize.define('posts', {
    id: {
        type: db.Sequelize.UUID,
        defaultValue: db.Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    title: {
        type: db.Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: db.Sequelize.TEXT,
        allowNull: false
    },
    content: {
        type: db.Sequelize.TEXT,
        allowNull: false
    },
    category: {
        type: db.Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: db.Sequelize.STRING,
        allowNull: false
    },
    author: {
        type: db.Sequelize.STRING,
        allowNull: false
    },
    authorId: {
        type: db.Sequelize.STRING,
        allowNull: false
    }
})

Post.sync({ force: false }).then(() => {
    console.log('[✓] PostDB conectado.')
}).catch(err => {
    console.log('[!] PostDB erro: ' + err)
})

module.exports = Post

