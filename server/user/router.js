const path = require('path')
const express = require('express')
const pug = require('pug')
const log4js = require('log4js')
const cookieparser = require('cookieparser')
const utils = require('../utils.js')
const MailSender = require('../mail/mailsender')
const { User, UserTmp } = require('../../db/database')
const Logger = require('../../src/log')
const Datatype = require('./defineDatatypes')

// import { resolve } from 'dns'

const router = express.Router()
const app = express()

app.use(log4js.connectLogger(log4js.getLogger('http'), { level: 'auto' }))

router.use((req, res, next) => {
  Object.setPrototypeOf(req, app.request)
  Object.setPrototypeOf(res, app.response)
  req.res = res
  res.req = req
  next()
})

const logger = new Logger('API /user')

/**
 *
 * @param {Request} req
 * @param {string} message
 */
function logError(req, message) {
  logger.error(req.originalUrl, `IP='${req.ip},IPS='${req.ips}'`, message)
}
/**
 *
 * @param {Request} req
 * @param {string} message
 */
function logInfo(req, message) {
  logger.info(req.originalUrl, `IP='${req.ip},IPS='${req.ips}'`, message)
}

function getAuthToken(req) {
  const token = req.body.token || req.headers['x-access-token']
  if (token) {
    const userData = User.validateAuthToken(token)
    return userData
  }

  if (req.headers.cookie) {
    const parsed = cookieparser.parse(req.headers.cookie)
    return parsed.auth
  }
  return null
}

/**
 * 認証トークンが無い場合はリクエストを拒否する
 *
 * @param {Request} req
 * @param {Response} res
 * @param {*} next
 */
function requireAuthToken(req, res, next) {
  const userData = getAuthToken(req)
  if (!userData) {
    logError(req, 'requireAuthToken: Detect Suspicious Access...')
    return res.status(403).json({
      message: '認証に失敗しました。'
    })
  }
  // リクエストにユーザーデータを付けて次のコールバックで使えるようにする
  req.userData = userData
  next()
}

/**
 * 認証トークンがある場合はユーザーページにリダイレクトする
 * @param {Request} req
 * @param {Response} res
 * @param {*} next
 */
function refusalAuthToken(req, res, next) {
  const userData = getAuthToken(req)
  if (userData) {
    logError(req, 'refusalAuthToken: Detect Suspicious Access...')
    return res.redirect('/user')
  }

  next()
}

router.post('/login', refusalAuthToken, async function(req, res) {
  try {
    const loginParam = new Datatype.LoginParameters(
      req.body.email,
      req.body.password
    )
    if (!loginParam.doValid) {
      logError(req, 'invalid paramaters')
      return res.status(202).json({
        isSuccessed: false,
        message: 'パラメータが正しくありません'
      })
    }

    const token = await User.login(loginParam)
    if (!token) {
      logError(req, 'failed to authentication')
      return res.status(202).json({
        isSuccessed: false,
        message: '認証に失敗しました'
      })
    }

    return res.json({
      isSuccessed: true,
      token: token
    })
  } catch (error) {
    logError(req, error)
    return res.status(500).send({
      isSuccessed: false,
      message: 'サーバー側の不具合により認証に失敗しました'
    })
  }
})

router.post('/logout', requireAuthToken, async function(req, res) {
  try {
    const isSuccessed = await User.logout(req.userData)
    if (!isSuccessed) {
      logError(req, 'failed to logout')
      return res.status(202).json({
        isSuccessed: false,
        message: 'ログアウトに失敗しました'
      })
    }

    return res.json({
      isSuccessed: true
    })
  } catch (error) {
    logError(req, error)
    return res.status(500).send({
      isSuccessed: false,
      message: 'サーバー側の不具合によりログアウトに失敗しました'
    })
  }
})

router.delete('/delete', requireAuthToken, async function(req, res) {
  try {
    const isSuccessed = await User.delete(req.userData)
    if (!isSuccessed) {
      logError(req, 'failed to delete user')
      return res.status(202).json({
        isSuccessed: false,
        message: 'ユーザーの削除に失敗しました'
      })
    }

    return res.json({
      isSuccessed: true
    })
  } catch (error) {
    logError(req, error)
    return res.status(500).send({
      isSuccessed: false,
      message: 'サーバー側の不具合によりユーザーの削除に失敗しました'
    })
  }
})

//* * 認証用メールのテンプレート*/
const authMailTemplateFn = pug.compileFile(
  path.resolve(__dirname, 'authMailTemplate.pug')
)

/**
 * ユーザー登録のAPI
 * req.bodyにはDatatype.SignupParametersに渡すことができるパラメータがあることを期待する
 */
router.post('/signup', refusalAuthToken, async function(req, res) {
  try {
    const signupParam = new Datatype.SignupParameters(
      req.body.name,
      req.body.email,
      req.body.password,
      {
        doSendMail: req.body.doSendMail
      }
    )
    if (!signupParam.doValid()) {
      logError(req, 'invalid parameters')
      return res.status(202).json({
        isSuccessed: false,
        messages: 'パラメータが正しくありません'
      })
    }

    if (await User.isExist(signupParam.name, signupParam.email)) {
      logError(req, 'invalid parameters because has duplicate parameter')
      return res.status(202).json({
        isSuccessed: false,
        messages: '既存のユーザーと同じ情報を持っています'
      })
    }

    const tokenOrError = await UserTmp.add(signupParam)
    if (typeof tokenOrError !== 'string') {
      logError(req, 'failed to add user')
      return res.status(202).json({
        isSuccessed: false,
        messages: tokenOrError
      })
    }

    if (signupParam.doSendMail) {
      const token = tokenOrError
      const htmlContent = authMailTemplateFn({
        url: `https://localhost:3000/user/signup/${token}`
      })
      const sender = new MailSender(
        '漢字組み立て工場　ユーザー確認',
        htmlContent
      )
      sender.send(`${req.body.name} <${req.body.email}>`)
    }

    return res.json({ isSuccessed: true })
  } catch (error) {
    logError(req, error)
    return res.status(500).send('Bad')
  }
})

router.post('/signup/:token', refusalAuthToken, async function(req, res) {
  try {
    const userInfo = await UserTmp.isValidToken(req.params.token)
    if (!userInfo) {
      throw new Error('Failed to create User...')
    }

    const user = await User.createWithUserInfo(userInfo)
    if (!user) {
      throw new Error('Failed to create User...')
    }
    logInfo(req, `create user name=${user.name},email=${user.email}`)
    res.set('Content-Type', 'text/html')
    return res.send('<h1>Success authentication user!</h1>')
  } catch (error) {
    logError(req, error)
    res.set('Content-Type', 'text/html')
    return res.status(202).send('<h1>Failed authentication user...</h1>')
  }
})

/** 使用しているユーザー情報を確認するためのURL
 * @params name  ユーザー名
 * @params email メールアドレス
 */
router.get('/check', async function(req, res) {
  let nameCount = 0
  if (req.query.name) {
    nameCount = await User.isExist(req.query.name, null)
    nameCount += await UserTmp.isExist(req.query.name, null)
  }
  let emailCount = 0
  if (req.query.email) {
    emailCount = await User.isExist(null, req.query.email)
    emailCount += await UserTmp.isExist(null, req.query.email)
  }

  return res.json({
    status: {
      name: nameCount > 0,
      email: emailCount > 0
    }
  })
})

module.exports = {
  path: utils.makeMiddlewarePath(__dirname),
  handler: router
}
