'use strict'
module.exports = (sequelize, DataTypes) => {
  const Hints = sequelize.define(
    'Hints',
    {
      question_id: DataTypes.INTEGER,
      level: DataTypes.TINYINT,
      text: DataTypes.TEXT,
      opened: {
        type: DataTypes.TINYINT,
        defaultValue: 0
      }
    },
    {
      getterMethods: {
        question_id() {
          return this.getDataValue('question_id')
        },
        level() {
          return this.getDataValue('level')
        },
        text() {
          return this.getDataValue('text')
        },
        opened() {
          return this.getDataValue('opened')
        },
        toClientObj() {
          const obj = {
            id: this.id,
            level: this.level,
            opened: this.opened !== 0
          }
          if (this.opened) {
            obj.text = this.text
          }
          return obj
        }
      }
    }
  )
  Hints.associate = function(models) {
    // associations can be defined here
  }
  Hints.getByQuestionId = async questionId => {
    try {
      return await Hints.findAll({
        where: {
          question_id: questionId
        }
      })
    } catch (err) {}
  }
  Hints.getByQuestionIDAndLevel = async (questionId, level) => {
    try {
      return await Hints.findOne({
        where: {
          question_id: questionId,
          level: level
        }
      })
    } catch (err) {
      return null
    }
  }
  return Hints
}
