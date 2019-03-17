const path = require('path')
const express = require('express')
const consola = require('consola')
const pug = require('pug')
const utils = require('../utils.js')
const MailSender = require('../mail/mailsender')
const { User, UserTmp } = require('../../db/database')
const Datatype = require('./defineDatatypes')

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

function getAuthToken(req) {
  const token = req.body.token || req.headers['x-access-token']
  if (!token) {
    return null
  }
  const userData = User.validateAuthToken(token)
  return userData
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
    consola.error(
      'requireAuthToken: Detect Suspicious Access...',
      `IP=${req.ip}`,
      `IPS=${req.ips}`
    )
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
    consola.error(
      'refusalAuthToken: Detect Suspicious Access...',
      `IP=${req.ip}`,
      `IPS=${req.ips}`
    )
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
      return res.status(202).json({
        isSuccessed: false,
        message: 'パラメータが正しくありません'
      })
    }

    const token = await User.login(loginParam)
    if (!token) {
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
    consola.error(error)
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
      return res.status(202).json({
        isSuccessed: false,
        message: 'ログアウトに失敗しました'
      })
    }

    return res.json({
      isSuccessed: true
    })
  } catch (error) {
    consola.error(error)
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
      return res.status(202).json({
        isSuccessed: false,
        message: 'ユーザーの削除に失敗しました'
      })
    }

    return res.json({
      isSuccessed: true
    })
  } catch (error) {
    consola.error(error)
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
      return res.status(202).json({
        isSuccessed: false,
        messages: 'パラメータが正しくありません'
      })
    }

    if (await User.isExist(signupParam.name, signupParam.email)) {
      return res.status(202).json({
        isSuccessed: false,
        messages: '既存のユーザーと同じ情報を持っています'
      })
    }

    const tokenOrError = await UserTmp.add(signupParam)
    if (typeof tokenOrError !== 'string') {
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
    consola.error(error)
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

    res.set('Content-Type', 'text/html')
    return res.send('<h1>Success authentication user!</h1>')
  } catch (error) {
    consola.error(error)
    res.set('Content-Type', 'text/html')
    return res.status(202).send('<h1>Failed authentication user...</h1>')
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
