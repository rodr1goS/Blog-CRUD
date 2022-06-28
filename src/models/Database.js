const Sequelize = require('sequelize')

const sequelize = new Sequelize(
    '', // nome do Banco de dados
    '', // usuário
    '', // senha
    {
        dialect: 'mysql',
        host: '' // endereço do db
    }
)

module.exports = {
    Sequelize : Sequelize,
    sequelize : sequelize
}
