const express = require('express')
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

function getAuthToken(req) {
  const token = req.body.token || req.headers['x-access-token']
  if (token) {
    const userAuth = User.parseAuthToken(token)
    return userAuth
  }

  if (req.headers.cookie) {
    const parsedCookie = cookieparser.parse(req.headers.cookie)
    if (parsedCookie.auth) {
      if (parsedCookie.auth === 'undefined' || parsedCookie.auth === 'null') {
        return null
      }
      return parsedCookie.auth
    }
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
  try {
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
  } catch (error) {
    logError(req, `requireAuthToken: internal error...${error}`)
    return res.status(500)
  }
}

/**
 * 認証トークンがある場合はユーザーページにリダイレクトする
 * @param {Request} req
 * @param {Response} res
 * @param {*} next
 */
function refusalAuthToken(req, res, next) {
  try {
    const userAuth = getAuthToken(req)
    if (userAuth) {
      logError(req, 'refusalAuthToken: Detect Suspicious Access...')
      return res.redirect('/user')
    }

    next()
  } catch (error) {
    logError(req, `refusalAuthToken: internal error...${error}`)
    return res.status(500)
  }
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

    const result = await User.login(loginParam)
    if (!result) {
      logError(req, 'failed to authentication')
      return res.status(403).json({
        message: '認証に失敗しました'
      })
    }
    const { user, token } = result
    if (MailSender.enableMail()) {
      const htmlContent = MailSender.getLoginMailContent(token)
      const sender = new MailSender(
        '漢字組み立て工場　ログインしました',
        htmlContent
      )
      sender.send(`${user.name}さま <${user.email}>`)
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
    const { isSuccessed, user, message } = await User.delete(
      req.userAuth,
      req.body.password
    )
    if (!isSuccessed) {
      logError(req, 'failed to delete user')
      return res.status(403).json({
        isSuccessed: false,
        message: message
      })
    }

    if (MailSender.enableMail()) {
      const htmlContent = MailSender.getDeleteMailContent()
      const sender = new MailSender(
        '漢字組み立て工場　ユーザー情報の削除',
        htmlContent
      )
      sender.send(`${user.name}さま <${user.email}>`)
    }

    return res.status(200).json({
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

router.get('/get', requireAuthToken, async function(req, res) {
  try {
    const user = await User.getByAuthToken(req.userAuth)
    if (user.error) {
      return res.status(403).send({
        notFoundUser: user.error === 2
      })
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
    const user = await User.getByAuthToken(req.userAuth)

    const updateParam = new Datatype.UpdateParameters(
      user.name !== req.body.name ? req.body.name : null,
      user.email !== req.body.email ? req.body.email : null,
      req.body.password || null,
      req.body.oldPassword
    )

    if (!updateParam.doValid()) {
      logError(req, 'pass to invalid parameters...', updateParam.toObj())
      return res.status(403).json({
        messages: {
          caption: '不当な値が渡されました。'
        }
      })
    }
    // 同名のユーザーやメールアドレスがないか確認する
    if (updateParam.name || updateParam.email) {
      if (await User.isExist(updateParam.name, updateParam.email)) {
        logError(
          req,
          'invalid parameters because has duplicate parameter',
          updateParam.toObj()
        )
        return res.status(403).json({
          messages: {
            caption: '既存のユーザーと同じ情報を持っています'
          }
        })
      }
    }

    const updateResultOrErrorMessages = await User.updateByParam(
      req.userAuth,
      updateParam
    )
    if (!updateResultOrErrorMessages.newToken) {
      logError(req, 'Failed to update user parameters...', updateParam.toObj())
      return res.status(403).json({
        messages: updateResultOrErrorMessages
      })
    }
    const updatedUser = updateResultOrErrorMessages.user
    const prevParam = updateResultOrErrorMessages.prevParam
    // 編集前のパラメータをどこかに保存しておく updateResult.prevParam

    // 更新したことを伝えるメールを送信する
    if (MailSender.enableMail()) {
      const htmlContent = MailSender.getUpdateMailContent()
      const sender = new MailSender(
        '漢字組み立て工場　ユーザー情報の更新',
        htmlContent
      )
      sender.send(
        `${updatedUser.name}さま <${updatedUser.email}>`,
        prevParam.email
      )
    }

    logInfo(req, 'OK')
    return res.json({
      token: updateResultOrErrorMessages.newToken
    })
  } catch (error) {
    logError(req, error, req.body)
    return res.status(500).send({
      message: {
        caption: 'サーバー側の不具合により情報の取得に失敗しました'
      }
    })
  }
})

/**
 * ユーザー登録のAPI
 * req.bodyにはDatatype.SignupParametersに渡すことができるパラメータがあることを期待する
 */
router.post('/signup', refusalAuthToken, async function(req, res) {
  try {
    const signupParam = new Datatype.SignupParameters(
      req.body.name,
      req.body.email,
      req.body.password
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

    if (MailSender.enableMail()) {
      const token = tokenOrError
      const htmlContent = MailSender.getAuthMailContent(token)
      const sender = new MailSender(
        '漢字組み立て工場　ユーザー確認',
        htmlContent
      )
      sender.send(`${req.body.name}さま <${req.body.email}>`)
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
