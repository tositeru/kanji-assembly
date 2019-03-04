'use strict'

const moment = require('moment')

function appendTimestamp(obj) {
  obj.createdAt = moment().toISOString()
  obj.updatedAt = moment().toISOString()
  return obj
}

function createQuestion(queryInterface, info, typeInfos, hints) {
  const appendQuestionId = (questionId, infos) => {
    for (const info of infos) {
      info.question_id = questionId
      appendTimestamp(info)
    }
  }
  return queryInterface
    .bulkInsert('Questions', [appendTimestamp(info)])
    .then(questionId => {
      appendQuestionId(questionId, typeInfos)
      return queryInterface.bulkInsert('QuestionType1s', typeInfos).then(() => {
        return questionId
      })
    })
    .then(questionId => {
      appendQuestionId(questionId, hints)
      return queryInterface.bulkInsert('Hints', hints)
    })
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    const t = moment('2019-03-01 00Z')
    return createQuestion(
      queryInterface,
      {
        show_date: t.toISOString(),
        date_id: 0,
        type: 1
      },
      [
        {
          description: "Q1's descriptions",
          answers: '木'
        }
      ],
      [
        {
          text: 'hint 1!!'
        },
        {
          text: 'hint 2!!'
        },
        {
          text: 'hint 3!!'
        }
      ]
    )
  },

  down: (queryInterface, Sequelize) => {
    return new Promise((resolve, reject) => {
      return queryInterface
        .bulkDelete('Questions', null, {})
        .then(() => {
          queryInterface.bulkDelete('QuestionType1s')
        })
        .then(() => {
          queryInterface.bulkDelete('Hints')
        })
    })
  }
}
