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
const { User, UserTmp } = require('../db/database')
const Utils = require('./utils')

axios.defaults.baseURL = 'http://localhost:3003'

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
  shell.exec('yarn sequelize db:seed --env=test --seed test-users')

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

  await axios.post(`user/signup/${token}`, {
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
async function deleteUser(userToken) {
  try {
    await axios.delete('user/delete', {
      data: {
        token: userToken
      },
      headers: {
        'Content-Length': userToken.length
      }
    })

    return true
  } catch (error) {
    assert.ok(false, `Failed to delete user... ${error}`)
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
        userData.password,
        {
          doSendMail: false // データベースを直接見るのでメールは送らない
        }
      )
      consola.log('request user/signup')
      const res = await axios.post('user/signup', param.toObj())
      assert.ok(
        res.data.isSuccessed,
        `invalid response parameter... msg=${res.data.messages}`
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
      const signupResponse = await axios.post(`user/signup/${token}`, {
        headers: {
          'Content-Type': 'text/html'
        }
      })
      assert.ok(
        signupResponse.status === 200,
        'invalid response parameter at signup/:token'
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
      assert.ok(logoutResposnse.status === 200, 'Failed to logout...')
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
          token: loginResposnse.data.token
        },
        headers: {
          'Content-Length': loginResposnse.data.token.length
        }
      })
      assert.ok(deleteResposnse.status === 200, 'Failed to delete user...')
    }
  }),
  new Utils.Test('test user/check', async test => {
    const userData = {
      name: 'Tom',
      email: 'tom@mail.com',
      password: '1234567890'
    }
    const tokenTom = await createUser(
      userData.name,
      userData.email,
      userData.password
    )
    test.pushDisposeObject(tokenTom, deleteUser)

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
    const tomData = new UserDatatype.SignupParameters(
      'Tom',
      'tom@mail.com',
      'tomtomtomtom',
      { doSendMail: false }
    )
    const tomToken = await createUser(
      tomData.name,
      tomData.email,
      tomData.password
    )
    test.pushDisposeObject(tomToken, deleteUser)

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
        !voidParamRes.data.isSuccessed,
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
        !sameNameRes.data.isSuccessed,
        'failed to reject the parameter including the already used name...'
      )

      const param2 = new UserDatatype.SignupParameters(
        reservingUserData.name,
        'hoge@mail.com.com',
        'tomotmotmo'
      )
      const sameNameRes2 = await axios.post('user/signup', param2)
      assert.ok(
        !sameNameRes2.data.isSuccessed,
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
        !sameEmailRes.data.isSuccessed,
        'failed to reject the parameter including the already used email...'
      )

      const param2 = new UserDatatype.SignupParameters(
        'Sum',
        reservingUserData.email,
        'tomotmotmo'
      )
      const sameEmailRes2 = await axios.post('user/signup', param2)
      assert.ok(
        !sameEmailRes2.data.isSuccessed,
        'failed to reject the parameter including the already used email in Usertmp...'
      )
    }
  }),
  // POST /user/login with void parameters
  // POST /user/login with invalid parameters
  new Utils.Test('test invalid post user/login', async test => {
    // POST /user/login with void parameters
    {
      const res = await axios.post('user/login', {})
      assert.ok(res.status === 202, 'failed to reject the void parameter...')
    }
    // POST /user/login with unexsiting parameters
    {
      const param = new UserDatatype.LoginParameters(
        'hgohgpr@jgvoi.com',
        'aaaaaaaaaaaaaaa'
      )
      const res = await axios.post('user/login', param)
      assert.ok(
        res.status === 202,
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
    test.pushDisposeObject(authToken, deleteUser)
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
      assert.ok(res.status === 202, 'failed to reject the missing password...')
    }
  }),
  new Utils.Test('test invalid POST user/logout', async test => {
    // POST /user/logout without auth token
    {
      const res = await axios.post('user/logout', {})
      assert.ok(
        res.status === 403 && !res.data.isSuccessed,
        'failed to logout without auth token...'
      )
    }
    // POST /user/logout with a invalid auth token
    {
      const invalidAuthToken = User.createAuthToken(
        'hog0934ug4jhg9[43ujgv[03u4wg'
      )
      const res = await axios.post('user/logout', { token: invalidAuthToken })
      assert.ok(
        res.status === 202 && !res.data.isSuccessed,
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
    test.pushDisposeObject(authToken, deleteUser)
    await axios.post('user/logout', { token: authToken })
    {
      const res = await axios.post('user/logout', { token: authToken })
      assert.ok(
        res.status === 202 && !res.data.isSuccessed,
        'failed to reject the logout user ...'
      )
    }
  }),
  new Utils.Test('test invalid POST user/delete', async test => {
    // POST /user/delete without auth token
    const res = await axios.delete('user/delete')
    assert.ok(
      res.status === 403 && !res.data.isSuccessed,
      'failed to delete without auth token...'
    )

    // POST /user/delete without invalid auth token
    // POST /user/delete without auth token
    {
      const invalidAuthToken = User.createAuthToken('eu9302ur390ru0439ur3094')
      const res = await axios.delete('user/delete', {
        data: {
          token: invalidAuthToken
        },
        headers: {
          'Content-Length': invalidAuthToken.length
        }
      })
      assert.ok(
        res.status === 202 && !res.data.isSuccessed,
        'failed to delete without auth token...'
      )
    }
  }),
  new Utils.Test('Test /user/get', async test => {
    const tomData = new UserDatatype.SignupParameters(
      'Tom',
      'tom@mail.com',
      'tomtomtomtom',
      { doSendMail: false }
    )
    const tomToken = await createUser(
      tomData.name,
      tomData.email,
      tomData.password
    )
    test.pushDisposeObject(tomToken, deleteUser)

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
        res.status === 403,
        'Failed to reject with invalid auth token...'
      )
    }
    // none auth token
    {
      const res = await axios.get('user/get')
      assert.ok(
        res.status === 403,
        'Failed to reject with a empty auth token...'
      )
    }
  })
]

Utils.run(tests, init)
