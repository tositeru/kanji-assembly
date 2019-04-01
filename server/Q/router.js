const express = require('express')
const utils = require('../utils.js')
const Logger = require('../../src/log')
const {
  Questions,
  QuestionType1,
  Hints,
  KanjiStrokes
} = require('../../db/database')

const logger = new Logger('API /Q')

/**
 *
 * @param {Request} req
 * @param {string} message
 */
function logError(req, message, appendParam = null) {
  logger.error(
    req.originalUrl,
    `IP='${req.ip},IPS='${req.ips} auth=${JSON.stringify(
      req.userAuth
    )}' ${JSON.stringify(appendParam)}`,
    message
  )
}

/**
 *
 * @param {Request} req
 * @param {string} message
 */
function logInfo(req, message) {
  logger.info(
    req.originalUrl,
    `IP='${req.ip},IPS='${req.ips}' auth=${JSON.stringify(req.userAuth)}`,
    message
  )
}

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
  const param = {
    date: req.body.date,
    dateId: req.body.dateId
  }
  if (typeof param.date !== 'string' || typeof param.dateId !== 'number') {
    logError(req, `invalid parameters param=${JSON.stringify(param)}`)
    return res.status(400).json({
      message: 'データ取得に失敗'
    })
  }

  try {
    const Q = await Questions.getByDate(param.date, param.dateId)
    if (!Q) {
      logError(req, `failed to get question... param=${JSON.stringify(param)}`)
      return res.status(400).json({
        message: 'データ取得に失敗'
      })
    }
    const QBody = await QuestionType1.findOne({
      where: {
        question_id: Q.id
      }
    })
    if (!QBody) {
      logError(
        req,
        `failed to get question type1... param=${JSON.stringify(param)},id=${
          Q.id
        }`
      )
      return res.status(400).json({
        message: 'データ取得に失敗'
      })
    }
    const hints = await Hints.getByQuestionId(Q.id)
    if (!hints) {
      logError(
        req,
        `failed to get hints... param=${JSON.stringify(param)},id=${Q.id}`
      )
      return res.status(400).json({
        message: 'データ取得に失敗'
      })
    }

    const kanji = QBody.answers[0]
    const strokes = await KanjiStrokes.getByKanji(kanji)
    if (!strokes) {
      logError(
        req,
        `failed to get kanji strokes... param=${JSON.stringify(param)},id=${
          Q.id
        },kanji=${kanji}`
      )
      return res.status(400).json({
        message: 'データ取得に失敗'
      })
    }

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

    logInfo(req, '')
    return res.json(question)
  } catch (error) {
    logError(req, error, param)
    return res.status(500).json({
      messages: 'エラーが発生しました'
    })
  }
})

router.post('/answer', async function(req, res) {
  const param = {
    date: req.body.date,
    dateId: req.body.dateId
  }
  if (typeof param.date !== 'string' || typeof param.dateId !== 'number') {
    logError(req, `invalid parameter param=${JSON.stringify(param)}`)
    return res.status(400).json({
      messages: 'データ取得に失敗'
    })
  }

  try {
    const Q = await Questions.getByDate(param.date, param.dateId)
    if (!Q) {
      logError(req, `failed to get question param=${JSON.stringify(param)}`)
      return res.status(400).json({
        messages: 'データ取得に失敗'
      })
    }
    const QBody = await QuestionType1.getByQuestionId(Q.id)
    if (!QBody) {
      logError(
        req,
        `failed to get question type1 param=${JSON.stringify(param)},id=${Q.id}`
      )
      return res.status(400).json({
        messages: 'データ取得に失敗'
      })
    }

    const answer = req.body.answers[0] || ''
    const isCorrect = QBody.answers.includes(answer)
    logInfo(req, 'OK')
    return res.json({
      isCorrect: isCorrect
    })
  } catch (error) {
    logError(req, error, param)
    return res.status(500).json({
      message: 'エラーが発生しました'
    })
  }
})

router.post('/openHint', async function(req, res) {
  // TODO Database check
  const param = {
    date: req.body.date,
    dateId: req.body.dateId,
    hintLevel: req.body.hintLevel
  }
  if (
    typeof param.date !== 'string' ||
    typeof param.dateId !== 'number' ||
    typeof param.hintLevel !== 'number'
  ) {
    logError(req, `invalid parameter param=${JSON.stringify(param)}`)
    return res.status(400).json({
      messages: 'データ取得に失敗'
    })
  }

  try {
    const Q = await Questions.getByDate(param.date, param.dateId)
    const hint = await Hints.getByQuestionIDAndLevel(Q.id, param.hintLevel)
    logInfo(req, 'OK')
    return res.send(hint.text)
  } catch (err) {
    logError(req, err, param)
    return res.status(500).send('failed to get hint...')
  }
})

router.get('/getListInMonth', async function(req, res) {
  try {
    if (!req.query.month) {
      logError(req, 'invalid parameters...', req.query.month)
      return res.status(400).send('failed to get question')
    }
    const questionDateList = await Questions.getQuestionListInMonth('2019-03')
    logInfo(req, 'OK')
    return res.json(questionDateList)
  } catch (err) {
    logError(req, err, req.query)
    return res.status(500).send('failed to get question list')
  }
})

module.exports = {
  path: utils.makeMiddlewarePath(__dirname),
  handler: router
}
