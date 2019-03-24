const path = require('path')
const consola = require('consola')
const nodemailer = require('nodemailer')
const pug = require('pug')
const striptags = require('striptags')
const Logger = require('../../src/log')

const logger = new Logger('Send Mail')

const baseURL = 'https://localhost:3000'

/**
 * 各メールのテンプレート
 */
const MAIL_TEMPLATE = {
  auth: pug.compileFile(
    path.resolve(__dirname, 'templates/authMailTemplate.pug')
  ),
  login: pug.compileFile(
    path.resolve(__dirname, 'templates/loginMailTemplate.pug')
  )
}

/**
 * メール送信用のクラス
 */
class MailSender {
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
   * @param {string} to
   */
  send(to) {
    if (process.env.NODE_ENV === 'test') {
      sendWhenNoneSenderMailAccount(to) // for test
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
      url: `${baseURL}/user/signup/${token}`
    })
  }

  /**
   * ログイン時のメールの本文を取得する
   */
  static getLoginMailContent() {
    return MAIL_TEMPLATE.login()
  }
}

/**
 * 送信用メールアカウントがないときに使う関数
 */
function sendWhenNoneSenderMailAccount(to) {
  // テスト用にEthereal Emailを使っている。
  consola.log('!!Use Ethereal Email for test. Please replace my mail account!!')

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

module.exports = MailSender
