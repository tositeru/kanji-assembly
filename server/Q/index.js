const express = require('express')
const utils = require('../utils.js')
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

router.post('/', function(req, res) {
  // TODO Query Database
  const question = {
    corrected: false,
    date: req.body.date,
    dateId: req.body.dateId,
    description: 'test description',
    lines: [{ kind: 'stroke04.gif', count: 1 }],
    hints: [{ text: '', opened: false }]
  }
  return res.json(question)
})

router.post('/answer', function(req, res) {
  const answer = req.body.answers[0] || ''
  return res.send(answer === '漢' ? 'OK' : 'NG')
})

router.post('/openHint', function(req, res) {
  // TODO Database check
  return res.send('hit text')
})

module.exports = {
  path: utils.makeMiddlewarePath(__dirname),
  handler: router
}
