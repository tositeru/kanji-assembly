const Sequelize = require('sequelize')
const config = require('./config.js')

const sequelize = new Sequelize(
  Object.assign(config.get(), {
    logging: function(msg) {
      this.consola.log('DATABASE QUERY: ', msg)
    },
    operatorsAliases: false
  })
)

module.exports = {
  Sequelize: sequelize,
  Questions: sequelize.import('./models/questions.js'),
  QuestionType1: sequelize.import('./models/questiontype1.js'),
  Hints: sequelize.import('./models/hints.js'),
  KanjiStrokes: sequelize.import('./models/kanjistrokes.js'),

  UserTmp: sequelize.import('./models/usertmp.js')
}