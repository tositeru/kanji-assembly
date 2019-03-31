const Sequelize = require('sequelize')

const usedOperatorsAliases = {
  $or: Sequelize.Op.or,
  $gte: Sequelize.Op.gte,
  $between: Sequelize.Op.between
}

const development = {
  username: 'wciantd',
  database: 'database_development',
  dialect: 'sqlite',
  storage: 'db/database.db',
  operatorsAliases: usedOperatorsAliases
}
const test = {
  username: 'wciantd',
  database: 'database_test',
  host: '127.0.0.1',
  dialect: 'sqlite',
  storage: 'db/database.test.db',
  operatorsAliases: usedOperatorsAliases
}
const production = {
  username: 'wciantd',
  password: null,
  database: 'database_production',
  dialect: 'sqlite',
  storage: 'db/database.db',
  operatorsAliases: usedOperatorsAliases
}

module.exports = {
  development: development,
  test: test,
  production: production,
  get() {
    switch (process.env.NODE_ENV) {
      case 'test':
        return test
      case 'production':
        return production
      default:
        return development
    }
  }
}
