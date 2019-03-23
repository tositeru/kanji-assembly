module.exports = {
  /**
   * パスワードの検証を行う
   * @param {string} password
   * @return {boolean}
   */
  validatePassword(password) {
    return (
      typeof password === 'string' &&
      (password.length >= 8 && password.length <= 255)
    )
  },

  /**
   * Sequlizeのエラーメッセージを元にクライアント側に見せるエラーメッセージを作成する
   * @param {object} userParameter
   * @param {object} sequelizeError sequelizeが起こしたエラー
   * @return {object}
   */
  createErrorMessage(userParameter, sequelizeError) {
    const checkColumns = [
      {
        name: 'name',
        message: '使用できない名前を登録に使用しました'
      },
      {
        name: 'email',
        message: '使用できないメールアドレスを登録に使用しました'
      }
    ]
    const errString = sequelizeError.toString()
    const errorMessages = {}
    for (const col of checkColumns) {
      if (errString.includes(col.name)) {
        errorMessages[col.name] = col.message
      }
    }
    // パスワードはハッシュ化しているので直接確認する
    if (typeof userParameter.password === 'string') {
      if (
        userParameter.password.length < 8 ||
        userParameter.password.length > 255
      ) {
        errorMessages.password = '使用できないパスワードを登録に使用しました'
      }
    }

    if (typeof userParameter.oldPassword === 'string') {
      if (
        userParameter.oldPassword.length < 8 ||
        userParameter.oldPassword.length > 255
      ) {
        errorMessages.oldPassword = '認証に失敗しました'
      }
    }
    return errorMessages
  }
}
