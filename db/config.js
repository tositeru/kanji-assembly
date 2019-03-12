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
    if (process.env.IS_TEST) {
      return test
    }

    switch (process.env.NODE_ENV) {
      case 'production':
        return production
      default:
        return development
    }
  }
}
