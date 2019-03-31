'use strict'
const { TABLE_DEFINETION } = require('../tables/hints.js')
const Logger = require('../../src/log')

const logger = new Logger('DB Hints')

module.exports = (sequelize, DataTypes) => {
  const Hints = sequelize.define('Hints', TABLE_DEFINETION, {
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
  })
  Hints.associate = function(models) {
    // associations can be defined here
  }
  Hints.getByQuestionId = async questionId => {
    try {
      const result = await Hints.findAll({
        where: {
          question_id: questionId
        }
      })
      logger.info('getByQuestionId', `Q id=${questionId}`)
      return result
    } catch (err) {
      logger.error('getByQuestionId', `Q id=${questionId}`, err)
      return null
    }
  }
  Hints.getByQuestionIDAndLevel = async (questionId, level) => {
    try {
      const result = await Hints.findOne({
        where: {
          question_id: questionId,
          level: level
        }
      })
      logger.info(
        'getByQuestionIDAndLevel',
        `Q id=${questionId},level=${level}`
      )
      return result
    } catch (err) {
      logger.error(
        'getByQuestionIDAndLevel',
        `Q id=${questionId},level=${level}`,
        err
      )
      return null
    }
  }
  return Hints
}
