'use strict'
const moment = require('moment')

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
  return Questions
}
