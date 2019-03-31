const path = require('path')
const consola = require('consola')
const nodemailer = require('nodemailer')
const pug = require('pug')
const striptags = require('striptags')
const Logger = require('../../src/log')

const logger = new Logger('Send Mail')

const baseURL = 'https://localhost:3000'

/**
 * URLを作成する
 * @param {string} router
 */
function makeUrl(router) {
  return path.join(baseURL, router)
}

/**
 * 各メールのテンプレート
 */
const MAIL_TEMPLATE = {
  auth: pug.compileFile(
    path.resolve(__dirname, 'templates/authMailTemplate.pug')
  ),
  login: pug.compileFile(
    path.resolve(__dirname, 'templates/loginMailTemplate.pug')
  ),
  update: pug.compileFile(
    path.resolve(__dirname, 'templates/updateMailTemplate.pug')
  ),
  delete: pug.compileFile(
    path.resolve(__dirname, 'templates/deleteMailTemplate.pug')
  ),
  resetPassword: pug.compileFile(
    path.resolve(__dirname, 'templates/resetPasswordMailTemplate.pug')
  )
}

/**
 * メール送信用のクラス
 */
class MailSender {
  /**
   * 現在の実行環境がメール送信を行うことを許可しているか？
   * テスト時にはメール送信を省略する必要があるので作成
   * @return {boolean}
   */
  static enableMail() {
    return process.env.NODE_ENV !== 'test'
  }

  constructor(subject, html) {
    this.setSubject(subject)
    this.setContents(html)
  }

  /**
   * タイトル設定
   * @param {string} subject
   */
  setSubject(subject) {
    this._subject = subject
  }

  /**
   * メール本文の設定。plainテキストは自動生成されます。
   * @param {string} html
   */
  setContents(html) {
    this._html = html
    // todo remove html tag from 'html'
    this._text = striptags(html)
  }

  /**
   * 設定されている内容でメールを送信する
   * @param {string|Array<string>} to
   * @param {string|Array<string>|null} cc
   */
  send(to, cc = null) {
    if (process.env.USE_TEST_MAIL) {
      this.sendWhenNoneSenderMailAccount(to, cc) // for test
      return
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: '465',
      secure: true,
      auth: {
        user: 'kanji.assembly@gmail.com',
        pass: 'Q$zcMGJM"{D5:+3y5i%n^Y&.h#MkLfVG'
      }
    })

    const message = {
      from: '漢字組み立て工場 <kanji.assembly@gmail.com>',
      to: to,
      subject: this._subject,
      text: this._text,
      html: this._html
    }
    if (cc) {
      message.cc = cc
    }

    transporter.sendMail(message, (err, info, response) => {
      if (err) {
        logger.error('Error', `to=${to},subject=${this._subject}`, err.message)
        return
      }

      logger.info(
        'Success',
        `id=${info.messageId},to=${to},subject=${this._subject}`,
        `response: ${response}`
      )
    })
  }

  /**
   * 認証用のメールの本文を取得する
   * @param {string} token 認証用の一時URLのトークン
   */
  static getAuthMailContent(token) {
    return MAIL_TEMPLATE.auth({
      url: makeUrl(`user/signup/${token}`)
    })
  }

  /**
   * ログイン時のメールの本文を取得する
   */
  static getLoginMailContent() {
    return MAIL_TEMPLATE.login()
  }

  /**
   * 更新時のメールの本文を取得する
   */
  static getUpdateMailContent() {
    return MAIL_TEMPLATE.update()
  }

  /**
   * 削除時のメールの本文を取得する
   */
  static getDeleteMailContent() {
    return MAIL_TEMPLATE.delete()
  }

  /**
   * 認証用のメールの本文を取得する
   * @param {string} token 認証用の一時URLのトークン
   */
  static getResetPasswordContent(token) {
    return MAIL_TEMPLATE.resetPassword({
      url: makeUrl(`user/reset-password/${token}`)
    })
  }
  /**
   * 送信用メールアカウントがないときに使う関数
   */
  sendWhenNoneSenderMailAccount(to, cc) {
    // テスト用にEthereal Emailを使っている。
    consola.log(
      '!!Use Ethereal Email for test. Please replace my mail account!!'
    )

    nodemailer.createTestAccount((err, account) => {
      if (err) {
        consola.error('Failed to create a testing account. ' + err.message)
        return process.exit(1)
      }

      // 送信者の情報
      // const sender = {
      //   name: 'Jeremy Roberts',
      //   email: 'jeremy42@ethereal.email',
      //   password: '1VBBDmGHzaW4MfBbAW',
      //   host: 'smtp.ethereal.email',
      //   port: 587,
      // }

      // Create a SMTP transporter object
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass
        }
      })

      // Message object
      const message = {
        from: 'Sender Name <sender@example.com>',
        to: to,
        cc: cc,
        subject: this._subject,
        text: this._text,
        html: this._html
      }

      transporter.sendMail(message, (err, info) => {
        if (err) {
          consola.error('Error occurred. ' + err.message)
          return
        }

        // 本番のメールアカウントを使ったら消す
        consola.log('Message sent: %s', info.messageId)
        consola.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
      })
    })
  }
}

module.exports = MailSender
