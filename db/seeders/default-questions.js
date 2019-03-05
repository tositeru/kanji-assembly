'use strict'

const moment = require('moment')

function appendTimestamp(obj) {
  obj.createdAt = moment().toISOString()
  obj.updatedAt = moment().toISOString()
  return obj
}

function createQuestion(queryInterface, info, typeInfos, hints) {
  const appendQuestionId = (questionId, infos) => {
    if (infos instanceof Array) {
      for (const info of infos) {
        info.question_id = questionId
        appendTimestamp(info)
      }
    } else {
      infos.question_id = questionId
      appendTimestamp(infos)
    }
  }
  return queryInterface
    .bulkInsert('Questions', [appendTimestamp(info)])
    .then(questionId => {
      appendQuestionId(questionId, typeInfos)
      return queryInterface
        .bulkInsert('QuestionType1s', [typeInfos])
        .then(() => {
          return questionId
        })
    })
    .then(questionId => {
      appendQuestionId(questionId, hints)
      return queryInterface.bulkInsert('Hints', hints)
    })
}

function makeQuestion(date, dateId, type) {
  return {
    show_date: moment(date).toISOString(),
    date_id: dateId,
    type: type
  }
}

function makeQuestionType1(description, answers) {
  return {
    description: description,
    answers: answers
  }
}

function makeHintsData(text, count) {
  const hints = []
  for (let i = 0; i < count; ++i) {
    hints.push({
      level: i,
      text: `${text}: ${i + 1}`
    })
  }
  return hints
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return createQuestion(
      queryInterface,
      makeQuestion('2019-03-01 00Z', 0, 1),
      makeQuestionType1("Q1's descriptions", '木'),
      makeHintsData('first question', 3)
    )
      .then(() =>
        createQuestion(
          queryInterface,
          makeQuestion('2019-03-02 00Z', 0, 1),
          makeQuestionType1("Q2's descriptions", '水'),
          makeHintsData('second question', 3)
        )
      )
      .then(() =>
        createQuestion(
          queryInterface,
          makeQuestion('2019-03-03 00Z', 0, 1),
          makeQuestionType1("Q3's descriptions", '火'),
          makeHintsData('third question', 3)
        )
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
