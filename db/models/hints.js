'use strict'
module.exports = (sequelize, DataTypes) => {
  const Hints = sequelize.define(
    'Hints',
    {
      text: DataTypes.TEXT,
      question_id: DataTypes.INTEGER
    },
    {}
  )
  Hints.associate = function(models) {
    // associations can be defined here
  }
  return Hints
}
