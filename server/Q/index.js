const express = require('express')
const Sequelize = require('sequelize')
const utils = require('../utils.js')

const sequelize = new Sequelize({
  username: 'wciantd',
  database: 'database_development',
  dialect: 'sqlite',
  storage: 'db/database.db',
  operatorsAliases: false
})

const Questions = sequelize.import('../../db/models/questions.js')
const QuestionType1 = sequelize.import('../../db/models/questiontype1.js')
const Hints = sequelize.import('../../db/models/hints.js')

// import { resolve } from 'dns'

const router = express.Router()
const app = express()
router.use((req, res, next) => {
  Object.setPrototypeOf(req, app.request)
  Object.setPrototypeOf(res, app.response)
  req.res = res
  res.req = req
  next()
})

router.post('/', async function(req, res) {
  // TODO Query Database
  const Q = await Questions.getByDate(req.body.date, req.body.date_id)
  if (!Q) {
    return res.send('Bad')
  }
  const QBody = await QuestionType1.findOne({
    where: {
      question_id: Q.id
    }
  })
  const hints = await Hints.getByQuestionId(Q.id)

  const question = {
    corrected: false,
    date: req.body.date,
    date_id: req.body.date_id,
    description: QBody.description,
    lines: [{ kind: 'stroke04.gif', count: 1 }],
    hints: []
  }
  for (const hint of hints) {
    question.hints.push(hint.toClientObj)
  }
  return res.json(question)
})

router.post('/answer', async function(req, res) {
  const Q = await Questions.getByDate(req.body.date, req.body.date_id)
  if (!Q) {
    return res.send('Bad')
  }
  const QBody = await QuestionType1.getByQuestionId(Q.id)
  if (!QBody) {
    return res.send('Bad')
  }

  const answer = req.body.answers[0] || ''
  const isCorrect = QBody.answers.includes(answer)
  return res.send(isCorrect ? 'OK' : 'NG')
})

router.post('/openHint', async function(req, res) {
  // TODO Database check
  try {
    const Q = await Questions.getByDate(req.body.date, req.body.date_id)
    const hint = await Hints.getByQuestionIDAndLevel(Q.id, req.body.hintLevel)
    return res.send(hint.text)
  } catch (err) {
    return res.status(500).send('failed to get hint...')
  }
})

module.exports = {
  path: utils.makeMiddlewarePath(__dirname),
  handler: router
}
