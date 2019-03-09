const path = require('path')
const express = require('express')
const consola = require('consola')
const pug = require('pug')
const utils = require('../utils.js')
const MailSender = require('../mail/mailsender')

const { UserTmp } = require('../../db/database')

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

const authMailTemplateFn = pug.compileFile(
  path.resolve(__dirname, 'authMailTemplate.pug')
)

router.post('/signup', async function(req, res) {
  try {
    const tokenOrError = await UserTmp.add(
      req.body.name,
      req.body.password,
      req.body.email
    )
    if (typeof tokenOrError !== 'string') {
      return res.status(202).json({
        isSuccessed: false,
        messages: tokenOrError
      })
    }
    const token = tokenOrError
    const htmlContent = authMailTemplateFn({
      url: `https://localhost:3000/user/signup/${token}`
    })
    const sender = new MailSender('漢字組み立て工場　ユーザー確認', htmlContent)
    sender.send(`${req.body.name} <${req.body.email}>`)

    return res.json({ isSuccessed: true })
  } catch (error) {
    consola.error(error)
    return res.status(500).send('Bad')
  }
})

router.get('/signup/:token', async function(req, res) {
  consola.log('complete authentication email')
  consola.info('TODO insert User from TmpUser and delte TmpUser')

  try {
    const isValid = await UserTmp.isValidToken(req.params.token)
    if (!isValid) {
      return res.send('<h1>Failed authentication user...</h1>')
    }

    res.set('Content-Type', 'text/html')
    return res.send('<h1>Success authentication user!</h1>')
  } catch (error) {
    consola.error(error)
    res.set('Content-Type', 'text/html')
    return res.send('<h1>Failed authentication user...</h1>')
  }
})

/** 使用しているユーザー情報を確認するためのURL
 * @params name  ユーザー名
 * @params email メールアドレス
 */
router.get('/check', function(req, res) {
  // TODO Query for User Table
  return res.json({
    status: {
      name: req.query.name !== 'Only',
      email: req.query.email !== 'same@mail.com'
    }
  })
})

module.exports = {
  path: utils.makeMiddlewarePath(__dirname),
  handler: router
}
