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
    const currentDate = moment()
    return createQuestion(
      queryInterface,
      makeQuestion(
        currentDate
          .clone()
          .subtract(3, 'day')
          .format('YYYY-MM-DD'),
        0,
        1
      ),
      makeQuestionType1("Q1's descriptions", '日'),
      makeHintsData('4画の漢字です', 3)
    )
      .then(() =>
        createQuestion(
          queryInterface,
          makeQuestion(
            currentDate
              .clone()
              .subtract(3, 'day')
              .format('YYYY-MM-DD'),
            1,
            1
          ),
          makeQuestionType1('3 day ago question2', '土干'),
          makeHintsData('複数解答があります', 2)
        )
      )
      .then(() =>
        createQuestion(
          queryInterface,
          makeQuestion(
            currentDate
              .clone()
              .subtract(3, 'day')
              .format('YYYY-MM-DD'),
            2,
            1
          ),
          makeQuestionType1('3 day ago question3', '水'),
          makeHintsData('部首にも使われます', 1)
        )
      )
      .then(() =>
        createQuestion(
          queryInterface,
          makeQuestion(
            currentDate
              .clone()
              .subtract(2, 'day')
              .format('YYYY-MM-DD'),
            0,
            1
          ),
          makeQuestionType1('2 day ago question1', '月'),
          makeHintsData('宇宙にあります', 3)
        )
      )
      .then(() =>
        createQuestion(
          queryInterface,
          makeQuestion(
            currentDate
              .clone()
              .subtract(2, 'day')
              .format('YYYY-MM-DD'),
            1,
            1
          ),
          makeQuestionType1('2 day ago question2', '金'),
          makeHintsData('曜日に使われています', 3)
        )
      )
      .then(() =>
        createQuestion(
          queryInterface,
          makeQuestion(
            currentDate
              .clone()
              .subtract(1, 'day')
              .format('YYYY-MM-DD'),
            0,
            1
          ),
          makeQuestionType1('1 day ago question1', '火'),
          makeHintsData('部首にも使われます', 3)
        )
      )
      .then(() =>
        createQuestion(
          queryInterface,
          makeQuestion(
            currentDate
              .clone()
              .subtract(1, 'day')
              .format('YYYY-MM-DD'),
            1,
            1
          ),
          makeQuestionType1('1 day ago question2', '木'),
          makeHintsData('4画の漢字です', 3)
        )
      )
      .then(() =>
        createQuestion(
          queryInterface,
          makeQuestion(currentDate.format('YYYY-MM-DD'), 0, 1),
          makeQuestionType1("Q3's descriptions", '水'),
          makeHintsData('third question', 3)
        )
      )
      .then(() =>
        createQuestion(
          queryInterface,
          makeQuestion(
            currentDate
              .clone()
              .add(1, 'day')
              .format('YYYY-MM-DD'),
            0,
            1
          ),
          makeQuestionType1('1 day ahead question1', '木'),
          makeHintsData('ひんっと', 3)
        )
      )
      .then(() =>
        createQuestion(
          queryInterface,
          makeQuestion(
            currentDate
              .clone()
              .add(1, 'day')
              .format('YYYY-MM-DD'),
            1,
            1
          ),
          makeQuestionType1('1 day ahead question2', '火'),
          makeHintsData('燃えろよ燃えろ', 3)
        )
      )
      .then(() =>
        createQuestion(
          queryInterface,
          makeQuestion(
            currentDate
              .clone()
              .add(2, 'day')
              .format('YYYY-MM-DD'),
            0,
            1
          ),
          makeQuestionType1('2 day ahead question1', '金'),
          makeHintsData('〇のなる木', 3)
        )
      )
      .then(() =>
        createQuestion(
          queryInterface,
          makeQuestion(
            currentDate
              .clone()
              .add(2, 'day')
              .format('YYYY-MM-DD'),
            1,
            1
          ),
          makeQuestionType1('2 day ahead question2', '月'),
          makeHintsData('花鳥風◯', 3)
        )
      )
      .then(() =>
        createQuestion(
          queryInterface,
          makeQuestion(
            currentDate
              .clone()
              .add(3, 'day')
              .format('YYYY-MM-DD'),
            0,
            1
          ),
          makeQuestionType1('2 day ahead question1', '土'),
          makeHintsData('ドドドドドドドッッッッッッッッッッ！', 3)
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
