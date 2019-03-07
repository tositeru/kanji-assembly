'use strict'
const moment = require('moment')
const consola = require('consola')

module.exports = (sequelize, DataTypes) => {
  const Questions = sequelize.define(
    'Questions',
    {
      show_date: DataTypes.DATEONLY,
      date_id: DataTypes.TINYINT,
      type: DataTypes.TINYINT
    },
    {
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
    }
  )
  Questions.associate = function(models) {}

  Questions.getByDate = async (date, dateId) => {
    try {
      const start = moment(date)
      const end = start.clone().add(1, 'day')
      return await Questions.findOne({
        where: {
          show_date: {
            [sequelize.Op.between]: [start.toISOString(), end.toISOString()]
          },
          date_id: dateId
        }
      })
    } catch (err) {
      return null
    }
  }

  Questions.getQuestionListInMonth = async month => {
    try {
      const start = moment(month, 'YYYY-MM')
      const end = start.clone().add(1, 'month')
      const list = await Questions.findAll({
        where: {
          show_date: {
            [sequelize.Op.between]: [
              start.format('YYYY-MM-DD'),
              end.format('YYYY-MM-DD')
            ]
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
      return questionList
    } catch (err) {
      consola.error(err)
      return null
    }
  }
  return Questions
}
