const databaseConfig = require('./knexfile')
const knex = require('knex')

const databaseConnection = knex(databaseConfig)

module.exports = { databaseConnection }