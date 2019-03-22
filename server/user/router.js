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
  logger.error(
    req.originalUrl,
    `IP='${req.ip},IPS='${req.ips} auth=${JSON.stringify(req.userAuth)}'`,
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

function getAuthToken(req) {
  const token = req.body.token || req.headers['x-access-token']
  if (token) {
    const userAuth = User.parseAuthToken(token)
    return userAuth
  }

  const parsedCookie = cookieparser.parse(req.headers.cookie)
  if (parsedCookie.auth) {
    if (parsedCookie.auth === 'undefined' ||
        parsedCookie.auth === 'null') {
      return null
    }
    return parsedCookie.auth
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
  const userAuth = getAuthToken(req)
  if (!userAuth) {
    logError(req, 'requireAuthToken: Detect Suspicious Access...')
    return res.status(401).json({
      message: '認証に失敗しました。'
    })
  }
  // リクエストにユーザーデータを付けて次のコールバックで使えるようにする
  req.userAuth = userAuth
  next()
}

/**
 * 認証トークンがある場合はユーザーページにリダイレクトする
 * @param {Request} req
 * @param {Response} res
 * @param {*} next
 */
function refusalAuthToken(req, res, next) {
  const userAuth = getAuthToken(req)
  if (userAuth) {
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
      return res.status(403).json({
        message: 'パラメータが正しくありません'
      })
    }

    const token = await User.login(loginParam)
    if (!token) {
      logError(req, 'failed to authentication')
      return res.status(403).json({
        message: '認証に失敗しました'
      })
    }

    logInfo(req, `email=${loginParam.email}`)
    return res.json({
      token: token
    })
  } catch (error) {
    logError(req, error)
    return res.status(500).send({
      message: 'サーバー側の不具合により認証に失敗しました'
    })
  }
})

router.post('/logout', requireAuthToken, async function(req, res) {
  try {
    const isSuccessed = await User.logout(req.userAuth)
    if (!isSuccessed) {
      logError(req, 'failed to logout')
      return res.status(403).json({
        message: 'ログアウトに失敗しました'
      })
    }

    return res.json()
  } catch (error) {
    logError(req, error)
    return res.status(500).send({
      message: 'サーバー側の不具合によりログアウトに失敗しました'
    })
  }
})

router.delete('/delete', requireAuthToken, async function(req, res) {
  try {
    const isSuccessed = await User.delete(req.userAuth)
    if (!isSuccessed) {
      logError(req, 'failed to delete user')
      return res.status(403).json({
        message: 'ユーザーの削除に失敗しました'
      })
    }

    return res.json()
  } catch (error) {
    logError(req, error)
    return res.status(500).send({
      message: 'サーバー側の不具合によりユーザーの削除に失敗しました'
    })
  }
})

router.get('/get', requireAuthToken, async function(req, res) {
  try {
    const user = await User.getByAuthToken(req.userAuth)
    if (!user) {
      return res.status(403)
    }

    logInfo(req, `OK`)
    return res.json({
      name: user.name,
      email: user.email
    })
  } catch (error) {
    logError(req, error)
    return res.status(500).send({
      message: 'サーバー側の不具合により情報の取得に失敗しました'
    })
  }
})

router.post('/update', requireAuthToken, async function(req, res) {
  try {
    const updateParam = new Datatype.UpdateParameters(
      req.body.name,
      req.body.email,
      req.body.password,
      req.body.oldPassword,
      req.body.doSendMail
    )

    //同名のユーザーやメールアドレスがないか確認する
    if (await User.isExist(updateParam.name, updateParam.email)) {
      logError(req, 'invalid parameters because has duplicate parameter')
      return res.status(403).json({
        messages: '既存のユーザーと同じ情報を持っています'
      })
    }

    const updateResult = await User.updateByParam(req.userAuth, updateParam)
    if (!updateResult) {
      logError(req, 'Failed to update user parameters...')
      return res.status(403).json({})
    }
    //updateResult.prevParam

    //更新したことを伝えるメールを送信する
    if (process.NODE_ENV !== 'test' || updateParam.doSendMail) {
      // TODO
    }

    logInfo(req, 'OK')
    return res.json({
      token: updateResult.newToken
    })
  } catch (error) {
    logError(req, error)
    return res.status(500).send({
      message: 'サーバー側の不具合により情報の取得に失敗しました'
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
      return res.status(403).json({
        messages: 'パラメータが正しくありません'
      })
    }

    if (await User.isExist(signupParam.name, signupParam.email)) {
      logError(req, 'invalid parameters because has duplicate parameter')
      return res.status(403).json({
        messages: '既存のユーザーと同じ情報を持っています'
      })
    }

    const tokenOrError = await UserTmp.add(signupParam)
    if (typeof tokenOrError !== 'string') {
      logError(req, 'failed to add user')
      return res.status(403).json({
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

    return res.json()
  } catch (error) {
    logError(req, error)
    return res.status(500).send('Bad')
  }
})

router.get('/signup/:token', refusalAuthToken, async function(req, res) {
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
    return res.status(403).send('<h1>Failed authentication user...</h1>')
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
