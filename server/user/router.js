const path = require('path')
const express = require('express')
const consola = require('consola')
const pug = require('pug')
const utils = require('../utils.js')
const MailSender = require('../mail/mailsender')

const { User, UserTmp } = require('../../db/database')

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

router.post('/login', async function(req, res) {
  try {
    const user = await User.login(req.body.email, req.body.password)
    if (!user) {
      return res.status(202).json({
        isSuccessed: false,
        message: '認証に失敗しました'
      })
    }

    const userID = 11111
    return res.json({
      isSuccessed: true,
      id: userID
    })
  } catch (error) {
    consola.error(error)
    return res.status(500).send('Bad')
  }
})

const authMailTemplateFn = pug.compileFile(
  path.resolve(__dirname, 'authMailTemplate.pug')
)

router.post('/signup', async function(req, res) {
  try {
    if (await User.isExist(req.body)) {
      return res.status(202).json({
        isSuccessed: false,
        messages: '既存のユーザーと同じ情報を持っています'
      })
    }

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
    const userInfo = await UserTmp.isValidToken(req.params.token)
    if (!userInfo) {
      return res.send('<h1>Failed authentication user...</h1>')
    }

    const user = await User.add(userInfo)
    if (!user) {
      throw new Error('Failed to add because User already exsits...')
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
