module.exports = {
  development: {
    username: 'wciantd',
    database: 'database_development',
    dialect: 'sqlite',
    storage: 'db/database.db',
    operatorsAliases: false
  },
  test: {
    username: 'wciantd',
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'sqlite',
    storage: 'db/database.db',
    operatorsAliases: false
  },
  production: {
    username: 'wciantd',
    password: null,
    database: 'database_production',
    dialect: 'sqlite',
    storage: 'db/database.db',
    operatorsAliases: false
  }
}
