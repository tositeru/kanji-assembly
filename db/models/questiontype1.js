'use strict'
const { TABLE_DEFINETION } = require('../tables/questions-type1.js')

module.exports = (sequelize, DataTypes) => {
  const QuestionType1 = sequelize.define('QuestionType1s', TABLE_DEFINETION, {
    getterMethods: {
      question_id() {
        return this.getDataValue(`question_id`)
      },
      description() {
        return this.getDataValue(`description`)
      },
      answers() {
        return this.getDataValue(`answers`)
      }
    }
  })

  QuestionType1.associate = function(models) {
    // associations can be defined here
  }

  QuestionType1.getByQuestionId = async questionId => {
    try {
      const Q = await QuestionType1.findOne({
        where: {
          question_id: questionId
        }
      })
      return Q
    } catch (error) {
      return null
    }
  }

  return QuestionType1
}
