const consola = require('consola')
const nodemailer = require('nodemailer')
const striptags = require('striptags')

class MailSender {
  constructor(subject, html) {
    this.setSubject(subject)
    this.setContents(html)
  }

  setSubject(subject) {
    this._subject = subject
  }
  setContents(html) {
    this._html = html
    // todo remove html tag from 'html'
    this._text = striptags(html)
  }

  send(to) {
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
