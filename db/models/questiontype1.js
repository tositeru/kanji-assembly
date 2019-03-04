'use strict'
module.exports = (sequelize, DataTypes) => {
  const QuestionType1 = sequelize.define(
    'QuestionType1s',
    {
      question_id: DataTypes.INTEGER,
      description: DataTypes.TEXT,
      answers: DataTypes.STRING
    },
    {}
  )
  QuestionType1.associate = function(models) {
    // associations can be defined here
  }
  return QuestionType1
}
