'use strict'
module.exports = (sequelize, DataTypes) => {
  const Questions = sequelize.define(
    'Questions',
    {
      show_date: DataTypes.DATEONLY,
      date_id: DataTypes.TINYINT,
      type: DataTypes.TINYINT
    },
    {}
  )
  Questions.associate = function(models) {}
  return Questions
}
