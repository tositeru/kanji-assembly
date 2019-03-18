const development = {
  username: 'wciantd',
  database: 'database_development',
  dialect: 'sqlite',
  storage: 'db/database.db',
  operatorsAliases: false
}
const test = {
  username: 'wciantd',
  database: 'database_test',
  host: '127.0.0.1',
  dialect: 'sqlite',
  storage: 'db/database.test.db',
  operatorsAliases: false
}
const production = {
  username: 'wciantd',
  password: null,
  database: 'database_production',
  dialect: 'sqlite',
  storage: 'db/database.db',
  operatorsAliases: false
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
