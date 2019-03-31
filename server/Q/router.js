const express = require('express')
const consola = require('consola')
const utils = require('../utils.js')
const {
  Questions,
  QuestionType1,
  Hints,
  KanjiStrokes
} = require('../../db/database')

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
  const Q = await Questions.getByDate(req.body.date, req.body.dateId)
  if (!Q) {
    return res.send('Bad')
  }
  const QBody = await QuestionType1.findOne({
    where: {
      question_id: Q.id
    }
  })
  const hints = await Hints.getByQuestionId(Q.id)

  const kanji = QBody.answers[0]
  const strokes = await KanjiStrokes.getByKanji(kanji)
  const question = {
    corrected: false,
    date: req.body.date,
    dateId: req.body.dateId,
    description: QBody.description,
    lines: [],
    hints: []
  }
  for (const stroke of strokes) {
    const index = question.lines.findIndex(l => l.kind === stroke.stroke_kind)
    if (index !== -1) {
      question.lines[index].count += 1
    } else {
      const l = {
        kind: stroke.stroke_kind,
        count: 1
      }
      question.lines.push(l)
    }
  }

  for (const hint of hints) {
    question.hints.push(hint.toClientObj)
  }
  return res.json(question)
})

router.post('/answer', async function(req, res) {
  const Q = await Questions.getByDate(req.body.date, req.body.dateId)
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
    const Q = await Questions.getByDate(req.body.date, req.body.dateId)
    const hint = await Hints.getByQuestionIDAndLevel(Q.id, req.body.hintLevel)
    return res.send(hint.text)
  } catch (err) {
    return res.status(500).send('failed to get hint...')
  }
})

router.get('/getListInMonth', async function(req, res) {
  try {
    if (!req.query.month) {
      return res.status(400).send('failed to get question')
    }
    consola.info(req.query.month)
    const questionDateList = await Questions.getQuestionListInMonth('2019-03')
    return res.json(questionDateList)
  } catch (err) {
    return res.statas(500).send('failed to get question list')
  }
})

module.exports = {
  path: utils.makeMiddlewarePath(__dirname),
  handler: router
}
