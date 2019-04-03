'use strict'
const moment = require('moment-timezone')
const { TABLE_DEFINETION } = require('../tables/questions.js')
const Logger = require('../../src/log')

const logger = new Logger('DB Question')

module.exports = (sequelize, DataTypes) => {
  const Questions = sequelize.define('Questions', TABLE_DEFINETION, {
    getterMethods: {
      show_date() {
        return this.getDataValue(`show_date`)
      },
      show_id() {
        return this.getDataValue(`show_id`)
      },
      type() {
        return this.getDataValue(`type`)
      }
    }
  })
  Questions.associate = function(models) {}

  Questions.getByDate = async (date, dateId) => {
    try {
      const start = moment.tz(`${date} 00:00:00`, 'Asia/Tokyo')
      const end = start.clone().add(1, 'day')
      logger.info('getByDate', `date=${date},dateId=${dateId}`)
      return await Questions.findOne({
        where: {
          show_date: {
            $between: [start.toISOString(), end.toISOString()]
          },
          date_id: dateId
        }
      })
    } catch (err) {
      logger.error('getByDate', `date=${date},dateId=${dateId}`, err)
      return null
    }
  }

  Questions.getQuestionListInMonth = async month => {
    try {
      const start = moment.tz(`${month}-01 00:00:00`, 'Asia/Tokyo')
      const end = start.clone().add(1, 'month')
      const list = await Questions.findAll({
        where: {
          show_date: {
            $between: [start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD')]
          }
        },
        order: [['show_date', 'asc'], ['date_id', 'asc']]
      })

      const questionList = {}
      for (const l of list) {
        const date = moment(l.show_date).format('YYYY-MM-DD')
        if (!questionList[date]) {
          questionList[date] = []
        }
        questionList[date].push(l.date_id)
      }
      logger.info('getQuestionListInMonth', `month=${month}`)
      return questionList
    } catch (err) {
      logger.error('getQuestionListInMonth', `month=${month}`, err)
      return null
    }
  }
  return Questions
}
