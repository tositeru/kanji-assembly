const Sequelize = require('sequelize')
const consola = require('consola')
const config = require('./config.js')

const usedOperatorsAliases = {
  $or: Sequelize.Op.or,
  $gte: Sequelize.Op.gte,
  $between: Sequelize.Op.between
}

const sequelize = new Sequelize(
  Object.assign(config.get(), {
    logging: function(msg) {
      consola.log('DATABASE QUERY: ', msg)
    },
    operatorsAliases: usedOperatorsAliases
  })
)

module.exports = {
  Sequelize: sequelize,
  Questions: sequelize.import('./models/questions.js'),
  QuestionType1: sequelize.import('./models/questiontype1.js'),
  Hints: sequelize.import('./models/hints.js'),
  KanjiStrokes: sequelize.import('./models/kanjistrokes.js'),

  UserTmp: sequelize.import('./models/usertmp.js'),
  User: sequelize.import('./models/user.js')
}
