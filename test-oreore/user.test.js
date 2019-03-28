/**
 * ユーザー認証周りのAPIをテストするためのコード
 * 実行する前にlocalhost:3000でテスト用サーバーを立ててください
 */

const assert = require('assert').strict
const axios = require('axios')
const consola = require('consola')
const shell = require('shelljs')
const sleep = require('sleep')
const UserDatatype = require('../server/user/defineDatatypes')
const { User, UserTmp, ResetPasswordUser } = require('../db/database')
const Utils = require('./utils')

axios.defaults.baseURL = 'http://localhost:3003'
axios.defaults.timeout = 1000

// テスト用にどんなレスポンスでも例外を投げないようにしている
axios.defaults.validateStatus = _ => {
  return true
}

/**
 * テスト環境の初期化
 */
async function init() {
  // データベースの状態を初期化する
  shell.exec('yarn sequelize db:migrate:undo:all --env=test')
  shell.exec('yarn sequelize db:migrate --env=test')
  // データベースにテスト用データを挿入する
  // shell.exec('yarn sequelize db:seed --env=test --seed test-users')

  // サーバーが起動しているか確認
  consola.info('check server running')
  consola.info('please run "yarn start-test".')
  while (true) {
    try {
      const res = await axios.get('/')
      if (res.status === 200) {
        consola.success('OK!!')
        break
      }
    } catch (error) {}
    sleep.msleep(500)
  }
}

// test 定義

/**
 * テスト用にメール認証を行っていないユーザーを作成する
 * 内部の処理はすべて正常に動くことを前提にしているので、関連するテストに失敗していた場合は実行結果を保証できません
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @return {string|null} auth-token
 */
async function createUserReservingToSignup(name, email, password) {
  try {
    const param = new UserDatatype.SignupParameters(name, email, password, {
      notSendMail: true // データベースを直接見るのでメールは送らない
    })
    await axios.post('user/signup', param.toObj())
  } catch (error) {
    assert.ok(false, `Failed to create user... ${error}`)
    return null
  }
}

/**
 * テスト用にユーザーを作成する
 * 内部の処理はすべて正常に動くことを前提にしているので、関連するテストに失敗していた場合は実行結果を保証できません
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @return {string|null} auth-token
 */
async function createUser(name, email, password) {
  const param = new UserDatatype.SignupParameters(name, email, password, {
    notSendMail: true // データベースを直接見るのでメールは送らない
  })
  await axios.post('user/signup', param.toObj())

  // query token by direct database
  const tmpUser = await UserTmp.findOne({
    where: {
      name: name,
      email: email
    }
  })
  const token = tmpUser.token

  await axios.get(`user/signup/${token}`, {
    headers: {
      'Content-Type': 'text/html'
    }
  })

  const loginParam = new UserDatatype.LoginParameters(email, password)
  const loginResposnse = await axios.post('user/login', loginParam.toObj())
  return loginResposnse.data.token
}

/**
 * ユーザートークンからユーザーを削除する
 * @param {string} userToken
 */
// async function deleteUser(userToken) {
//   try {
//     await axios.delete('user/delete', {
//       data: {
//         token: userToken
//       },
//       headers: {
//         'Content-Length': userToken.length
//       }
//     })

//     return true
//   } catch (error) {
//     assert.ok(false, `Failed to delete user... ${error}`)
//     return false
//   }
// }

/**
 * 全ユーザーを削除する
 */
async function deleteAllUser() {
  try {
    await User.destroy({
      where: {
        deletedAt: null
      },
      force: true
    })
  } catch (error) {
    consola.error('全ユーザーの削除に失敗')
    return false
  }
}

/** @type {Array<Test>} */
const tests = [
  // 成功パターン
  new Utils.Test('success pattern', async test => {
    const userData = {
      name: 'Tom',
      email: 'tom@mail.com',
      password: '1234567890'
    }

    {
      // POST /user/signup with valid parameters
      // POST /user/signup/:token with valid parameters
      const param = new UserDatatype.SignupParameters(
        userData.name,
        userData.email,
        userData.password
      )
      consola.log('request user/signup')
      const res = await axios.post('user/signup', param.toObj())
      assert.ok(
        res.status === 200,
        `invalid response parameter... status=${res.status} msg=${
          res.data.messages
        }`
      )

      // query token by direct database
      const tmpUser = await UserTmp.findOne({
        where: {
          name: userData.name,
          email: userData.email
        }
      })
      const token = tmpUser.token

      consola.log('request user/signup/<valid_token>')
      const signupResponse = await axios.get(`user/signup/${token}`, {
        headers: {
          'Content-Type': 'text/html'
        }
      })
      assert.ok(
        signupResponse.status === 200,
        `invalid response parameter at signup/:token... status=${
          signupResponse.status
        }`
      )
    }

    // POST /user/login with vaild parameters
    // POST /user/logout with auth token
    {
      consola.log('request user/login')
      const loginParam = new UserDatatype.LoginParameters(
        userData.email,
        userData.password
      )
      const loginResposnse = await axios.post('user/login', loginParam.toObj())
      assert.ok(
        loginResposnse.status === 200,
        `Falied to login... msg=${loginResposnse.data.message}`
      )
      assert.ok(
        loginResposnse.data.token,
        'Falied to login by invalid token...'
      )

      consola.log('request user/logout')
      const logoutResposnse = await axios.post('user/logout', {
        token: loginResposnse.data.token
      })
      assert.ok(
        logoutResposnse.status === 200,
        `Failed to logout... status=${logoutResposnse.status}`
      )
    }

    // DELETE /user/delete with auth token
    {
      const loginParam = new UserDatatype.LoginParameters(
        userData.email,
        userData.password
      )
      const loginResposnse = await axios.post('user/login', loginParam.toObj())
      assert.ok(loginResposnse.status === 200, 'Falied to login...')
      assert.ok(
        loginResposnse.data.token,
        'Falied to login by invalid token...'
      )
      consola.log('request user/delete')
      const deleteResposnse = await axios.delete('user/delete', {
        data: {
          password: userData.password
        },
        headers: {
          'x-access-token': loginResposnse.data.token,
          'Content-Length': userData.password
        }
      })
      assert.ok(
        deleteResposnse.status === 200,
        `Failed to delete user... status=${deleteResposnse.status}`
      )
    }
  }),
  new Utils.Test('test user/check', async test => {
    test.pushDisposeObject(null, deleteAllUser)

    const userData = {
      name: 'Tom',
      email: 'tom@mail.com',
      password: '1234567890'
    }
    await createUser(userData.name, userData.email, userData.password)

    {
      const { data } = await axios.get('user/check', {
        params: {}
      })
      assert.ok(
        !data.status.name && !data.status.email,
        'failed to validate the none param...'
      )
    }

    {
      const { data } = await axios.get('user/check', {
        params: {
          name: userData.name,
          email: userData.email
        }
      })
      assert.ok(
        data.status.name && data.status.email,
        'failed to validate the exsit params...'
      )
    }

    {
      const { data } = await axios.get('user/check', {
        params: {
          name: userData.name
        }
      })
      assert.ok(
        data.status.name && !data.status.email,
        'failed to validate the same name...'
      )
    }

    {
      const { data } = await axios.get('user/check', {
        params: {
          name: userData.name,
          email: 'hoge@mail.com.com'
        }
      })
      assert.ok(
        data.status.name && !data.status.email,
        'failed to validate the same name at part 2...'
      )
    }

    {
      const { data } = await axios.get('user/check', {
        params: {
          email: userData.email
        }
      })
      assert.ok(
        !data.status.name && data.status.email,
        'failed to validate the same email...'
      )
    }

    {
      const { data } = await axios.get('user/check', {
        params: {
          name: 'aoajodjapodjwopjfepo',
          email: userData.email
        }
      })
      assert.ok(
        !data.status.name && data.status.email,
        'failed to validate the same email at part 2...'
      )
    }
  }),
  new Utils.Test('test invalid post user/signup', async test => {
    test.pushDisposeObject(null, deleteAllUser)
    const tomData = new UserDatatype.SignupParameters(
      'Tom',
      'tom@mail.com',
      'tomtomtomtom'
    )
    await createUser(tomData.name, tomData.email, tomData.password)

    const reservingUserData = new UserDatatype.SignupParameters(
      'Sara',
      'sara@mail.com',
      'sarasrarsara'
    )
    await createUserReservingToSignup(
      reservingUserData.name,
      reservingUserData.email,
      reservingUserData.password
    )

    // POST /user/signup with void parameters
    {
      const voidParamRes = await axios.post('user/signup', {})
      assert.ok(
        voidParamRes.status !== 200,
        'failed to reject void parameters...'
      )
    }
    // POST /user/signup with already used name in parameters
    {
      const param = new UserDatatype.SignupParameters(
        tomData.name,
        'hoge@mail.com.com',
        'tomotmotmo'
      )
      const sameNameRes = await axios.post('user/signup', param)
      assert.ok(
        sameNameRes.status !== 200,
        'failed to reject the parameter including the already used name...'
      )

      const param2 = new UserDatatype.SignupParameters(
        reservingUserData.name,
        'hoge@mail.com.com',
        'tomotmotmo'
      )
      const sameNameRes2 = await axios.post('user/signup', param2)
      assert.ok(
        sameNameRes2.status !== 200,
        'failed to reject the parameter including the already used name in Usertmp...'
      )
    }
    // POST /user/signup with already used email in parameters
    {
      const param = new UserDatatype.SignupParameters(
        'Sum',
        tomData.email,
        'tomotmotmo'
      )
      const sameEmailRes = await axios.post('user/signup', param)
      assert.ok(
        sameEmailRes.status !== 200,
        'failed to reject the parameter including the already used email...'
      )

      const param2 = new UserDatatype.SignupParameters(
        'Sum',
        reservingUserData.email,
        'tomotmotmo'
      )
      const sameEmailRes2 = await axios.post('user/signup', param2)
      assert.ok(
        sameEmailRes2.status !== 200,
        'failed to reject the parameter including the already used email in Usertmp...'
      )
    }
  }),
  // POST /user/login with void parameters
  // POST /user/login with invalid parameters
  new Utils.Test('test invalid post user/login', async test => {
    test.pushDisposeObject(null, deleteAllUser)
    // POST /user/login with void parameters
    {
      const res = await axios.post('user/login')
      assert.ok(res.status === 403, 'failed to reject the void parameter...')
    }
    // POST /user/login with unexsiting parameters
    {
      const param = new UserDatatype.LoginParameters(
        'hgohgpr@jgvoi.com',
        'aaaaaaaaaaaaaaa'
      )
      const res = await axios.post('user/login', param)
      assert.ok(
        res.status === 403,
        'failed to reject the unexsiting parameter...'
      )
    }

    // POST /user/login with the already login user
    const tomData = new UserDatatype.SignupParameters(
      'Tom',
      'tom@mail.com',
      'tomtomtomtom'
    )
    const authToken = await createUser(
      tomData.name,
      tomData.email,
      tomData.password
    )
    {
      const param = new UserDatatype.LoginParameters(
        tomData.email,
        tomData.password
      )
      const res = await axios.post('user/login', param.toObj())
      assert.ok(res.status === 200, 'failed to login for already login user...')
    }
    await axios.post('user/logout', {
      token: authToken
    })

    // POST /user/login with the invalid password
    {
      const param = new UserDatatype.LoginParameters(
        tomData.email,
        'invalid password'
      )
      const res = await axios.post('user/login', param)
      assert.ok(res.status === 403, 'failed to reject the missing password...')
    }
  }),
  new Utils.Test('test invalid POST user/logout', async test => {
    test.pushDisposeObject(null, deleteAllUser)
    // POST /user/logout without auth token
    {
      const res = await axios.post('user/logout', {})
      assert.ok(res.status === 401, 'failed to logout without auth token...')
    }
    // POST /user/logout with a invalid auth token
    {
      const invalidAuthToken = User.createAuthToken(
        'hog0934ug4jhg9[43ujgv[03u4wg',
        '2000-01-01 12:30:30',
        '2001-02-01 13:32:32'
      )
      const res = await axios.post('user/logout', { token: invalidAuthToken })
      assert.ok(
        res.status === 403,
        'failed to logout with a invalid auth token...'
      )
    }
    // POST /user/logout not login user
    const tomData = new UserDatatype.SignupParameters(
      'Tom',
      'tom@mail.com',
      'tomtomtomtom'
    )
    const authToken = await createUser(
      tomData.name,
      tomData.email,
      tomData.password
    )
    await axios.post('user/logout', { token: authToken })
    {
      const res = await axios.post('user/logout', { token: authToken })
      assert.ok(res.status === 403, 'failed to reject the logout user ...')
    }
  }),
  new Utils.Test('test invalid POST user/delete', async test => {
    // POST /user/delete without auth token
    const res = await axios.delete('user/delete')
    assert.ok(res.status === 401, 'failed to delete without auth token...')
    test.pushDisposeObject(null, deleteAllUser)

    // POST /user/delete without invalid auth token
    // POST /user/delete without auth token
    {
      const invalidAuthToken = User.createAuthToken(
        'eu9302ur390ru0439ur3094',
        '2000-01-02 12:30:30',
        '2001-02-03 13:32:32'
      )
      const password = 'sojhp'
      const res = await axios.delete('user/delete', {
        data: {
          password: password
        },
        headers: {
          'x-access-token': invalidAuthToken,
          'Content-Length': password.length
        }
      })
      assert.ok(
        res.status === 403,
        `Case Invalid Auth Token: invalid status... status=${res.status}`
      )
      assert.ok(
        res.data.message,
        `Case Invalid Auth Token: Do not have error message... status=${JSON.stringify(
          res.data
        )}`
      )
      assert.ok(
        res.data.isSuccessed === false,
        `Case Invalid Auth Token: Invalid isSuccessed... status=${JSON.stringify(
          res.data
        )}`
      )
    }
    {
      const userData = new UserDatatype.SignupParameters(
        'Tom',
        'tom@mail.com',
        'tomtomtom'
      )
      const token = await createUser(
        userData.name,
        userData.email,
        userData.password
      )
      const invalidPassword = 'invalidpassword'
      const res = await axios.delete('user/delete', {
        data: {
          password: 'invalid password'
        },
        headers: {
          'x-access-token': token,
          'Content-Length': invalidPassword.length
        }
      })
      assert.ok(
        res.status === 403,
        `Case Invalid Password: invalid status... status=${res.status}`
      )
      assert.ok(
        res.data.message,
        `Case Invalid Password: Do not have error message... status=${JSON.stringify(
          res.data
        )}`
      )
      assert.ok(
        res.data.isSuccessed === false,
        `Case Invalid Password: Invalid isSuccessed... status=${JSON.stringify(
          res.data
        )}`
      )
    }
  }),
  new Utils.Test('Test GET /user/get', async test => {
    test.pushDisposeObject(null, deleteAllUser)

    const tomData = new UserDatatype.SignupParameters(
      'Tom',
      'tom@mail.com',
      'tomtomtomtom'
    )
    const tomToken = await createUser(
      tomData.name,
      tomData.email,
      tomData.password
    )

    // success
    {
      const res = await axios.get('user/get', {
        headers: {
          'x-access-token': tomToken
        }
      })
      assert.ok(
        res.status === 200 &&
          res.data.name === tomData.name &&
          res.data.email === tomData.email,
        'failed to get user parameters...'
      )
    }
    // invalid auth token
    {
      const res = await axios.get('user/get', {
        headers: {
          'x-access-token': 'jd903jf9h43wt9g0t3y4vtnhg 09[n3uvt0934un tv90'
        }
      })
      assert.ok(
        res.status === 401,
        'Failed to reject with invalid auth token...'
      )
    }
    // none auth token
    {
      const res = await axios.get('user/get')
      assert.ok(
        res.status === 401,
        'Failed to reject with a empty auth token...'
      )
    }
  }),
  new Utils.Test('Test POST /user/update', async test => {
    test.pushDisposeObject(null, deleteAllUser)
    // success
    {
      const tomData = new UserDatatype.SignupParameters(
        'Tom',
        'tom@mail.com',
        'tomtomtomtom'
      )
      const tomToken = await createUser(
        tomData.name,
        tomData.email,
        tomData.password
      )

      const updateParam = new UserDatatype.UpdateParameters(
        'Tom2',
        'tom2@mail.com',
        'tom2tom2tom2tom2',
        tomData.password,
        false
      )
      const res = await axios.post(
        'user/update',
        Object.assign(updateParam.toObj(), {
          token: tomToken
        })
      )
      const newAuthToken = res.data.token
      assert.ok(res.status === 200, 'Failed to update user parameters...')
      assert.ok(
        newAuthToken && newAuthToken !== tomToken,
        'Failed to update user parameters by the invalid auth token...'
      )

      // name and email check
      const nameAndEmailRes = await axios.get('user/get', {
        headers: {
          'x-access-token': newAuthToken
        }
      })
      assert.ok(
        nameAndEmailRes.status === 200,
        `Failed to update user parameters by the invalid auth token... status=${
          nameAndEmailRes.status
        }`
      )
      assert.ok(
        nameAndEmailRes.data.name === updateParam.name,
        `Failed to update the name of user... name=${nameAndEmailRes.data.name}`
      )
      assert.ok(
        nameAndEmailRes.data.email === updateParam.email,
        `Failed to update the email of user... name=${
          nameAndEmailRes.data.email
        }`
      )

      // password check
      const passwordRes = await axios.post('user/login', {
        email: updateParam.email,
        password: updateParam.password
      })
      assert.ok(passwordRes.status === 200, 'Failed to update user password...')
    }
    // invalid parameter
    {
      const saraData = new UserDatatype.SignupParameters(
        'Sara',
        'Sara@mail.com',
        'tomtomtomtom'
      )
      const saraToken = await createUser(
        saraData.name,
        saraData.email,
        saraData.password
      )
      {
        // invalid oldPassword
        const updateParam = new UserDatatype.UpdateParameters(
          'Sara2',
          'tom2@mail.com',
          'tom2tom2tom2tom2',
          'hifh94ur94ur490tjepgj',
          false
        )
        const res = await axios.post(
          'user/update',
          Object.assign(updateParam.toObj(), {
            token: saraToken
          })
        )
        assert.ok(
          res.status === 403,
          'Failed to update user info because input ot the invalid oldPassword...'
        )
      }
      {
        // invalid input parameters
        let updateParam = new UserDatatype.UpdateParameters(
          '',
          'tom2', // invalid email
          '',
          saraData.password,
          false
        )
        let res = await axios.post(
          'user/update',
          Object.assign(updateParam.toObj(), {
            token: saraToken
          })
        )
        assert.ok(
          res.status === 403,
          `Invalid Response status... status=${res.status}`
        )
        assert.ok(
          res.data.messages.email,
          `Do not exsit error messages.email... messages=${JSON.stringify(
            res.data.messages
          )}`
        )

        // invalid name
        updateParam = new UserDatatype.UpdateParameters(
          'aa', // invalid name
          '',
          '',
          saraData.password,
          false
        )
        res = await axios.post(
          'user/update',
          Object.assign(updateParam.toObj(), {
            token: saraToken
          })
        )
        assert.ok(
          res.status === 403,
          `Invalid Response status... status=${res.status}`
        )
        assert.ok(
          res.data.messages.name,
          `Do not exsit error messages.name... messages=${JSON.stringify(
            res.data.messages
          )}`
        )

        // invalid password
        updateParam = new UserDatatype.UpdateParameters(
          '',
          '',
          'aaa', // invalid password
          saraData.password,
          false
        )
        res = await axios.post(
          'user/update',
          Object.assign(updateParam.toObj(), {
            token: saraToken
          })
        )
        assert.ok(
          res.status === 403,
          `Invalid Response status... status=${res.status}`
        )
        assert.ok(
          res.data.messages.password,
          `Do not exsit error messages.password... messages=${JSON.stringify(
            res.data.messages
          )}`
        )
      }
      {
        // invalid auth token
        const updateParam = new UserDatatype.UpdateParameters(
          'Sara', // invalid name
          'sara@mail.com', // invalid email
          '',
          saraData.password,
          false
        )
        const res = await axios.post(
          'user/update',
          Object.assign(updateParam.toObj(), {
            token: 'invalid auth token'
          })
        )
        assert.ok(
          res.status === 401,
          `Failed to update user info because invalid auth token... data=${
            res.status
          }`
        )
      }
      {
        // already same parameters
        const otherData = new UserDatatype.SignupParameters(
          'Other',
          'other@mail.com',
          'otherother'
        )
        await createUser(otherData.name, otherData.email, otherData.password)

        const updateParam = new UserDatatype.UpdateParameters(
          otherData.name, // invalid name
          otherData.email, // invalid email
          '',
          saraData.password,
          false
        )
        const res = await axios.post(
          'user/update',
          Object.assign(updateParam.toObj(), {
            token: saraToken
          })
        )
        assert.ok(
          res.status === 403,
          `Failed to update user info because already same parameters... status=${
            res.status
          }`
        )
      }
    }
  }),
  new Utils.Test('Test reset password', async test => {
    test.pushDisposeObject(null, deleteAllUser)
    const userData = UserDatatype.SignupParameters(
      'Tom',
      'tom@mail.com',
      'tomtomtom'
    )
    const token = await createUser(
      userData.name,
      userData.email,
      userData.password
    )
    // success
    {
      const res = axios.post('/user/request-reset-password', {
        email: userData.email
      })
      assert.ok(
        res.status === 200,
        `/user/request-reset-password: Invalid status ${res.status}`
      )

      const requestUser = await ResetPasswordUser.findOne({
        where: {
          email: userData.email
        }
      })

      const newPasswrod = 'tomtomtomtom'
      const urlToken = requestUser.token
      const resetPasswordRes = await axios.post('/user/reset-password', {
        token: urlToken,
        password: newPasswrod
      })
      assert.ok(
        resetPasswordRes.status === 200,
        `/user/reset-password : Invalid status ${resetPasswordRes.status}`
      )

      // 確認
      const loginParam = new UserDatatype.LoginParameters(
        userData.email,
        newPasswrod
      )
      const loginRes = await axios.post('/user/login', loginParam.toObj)
      assert.ok(
        loginRes.status,
        `Check /user/login: Invalid status ${loginRes.status}`
      )
      assert.ok(
        loginRes.data.token !== token,
        `Check /user/login: Not change Auth Token...`
      )
    }

    // /user/request-reset-password invalid email
    {
      const res = await axios.post('/user/request-reset-password', {
        email: 'invalid email'
      })
      assert.ok(
        res.status === 400,
        `/user/request-reset-password Invalid email : Invalid status ${
          res.status
        }`
      )
    }
    // /user/reset-password invalid token
    {
      const res = await axios.post('/user/reset-password', {
        token: 'invalid token',
        email: userData.email
      })
      assert.ok(
        res.status === 400,
        `/user/reset-password Invalid token : Invalid status ${res.status}`
      )
      assert.ok(
        res.data.message,
        `/user/reset-password Invalid token : Do not exsit message ${JSON.stringly(
          res.data
        )}`
      )
    }
    // /user/reset-password invalid email
    {
      // 前準備
      const requestResetPasswordRes = axios.post(
        '/user/request-reset-password',
        {
          email: userData.email
        }
      )
      assert.ok(
        requestResetPasswordRes.status === 200,
        `/user/request-reset-password: Invalid status ${
          requestResetPasswordRes.status
        }`
      )
      const requestUser = await ResetPasswordUser.findOne({
        where: {
          email: userData.email
        }
      })

      // テスト内容
      const res = await axios.post('/user/reset-password', {
        token: requestUser.token,
        email: 'invalid email'
      })
      assert.ok(
        res.status === 400,
        `/user/reset-password Invalid email : Invalid status ${res.status}`
      )
      assert.ok(
        res.data.message,
        `/user/reset-password Invalid email : Do not exsit message ${JSON.stringly(
          res.data
        )}`
      )
    }
  })
]

Utils.run(tests, init)
