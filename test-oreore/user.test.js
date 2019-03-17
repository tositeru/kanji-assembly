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
const { UserTmp } = require('../db/database')
const Utils = require('./utils')

axios.defaults.baseURL = 'http://localhost:3003'

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
 * テスト用にユーザーを作成する
 * 内部の処理はすべて正常に動くことを前提にしているので、関連するテストに失敗していた場合は実行結果を保証できません
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @return {string|null} auth-token
 */
async function createUser(name, email, password) {
  try {
    const param = UserDatatype.makeSignupParameters(name, email, password, {
      notSendMail: true // データベースを直接見るのでメールは送らない
    })
    await axios.post('user/signup', param)

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

    const loginParam = UserDatatype.makeLoginParameters(email, password)
    const loginResposnse = await axios.post('user/login', loginParam)
    return loginResposnse.data.token
  } catch (error) {
    assert.ok(false, `Failed to create user... ${error}`)
    return null
  }
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
      const param = UserDatatype.makeSignupParameters(
        userData.name,
        userData.email,
        userData.password,
        {
          notSendMail: true // データベースを直接見るのでメールは送らない
        }
      )
      consola.log('request user/signup')
      const res = await axios.post('user/signup', param)
      assert.ok(res.data.isSuccessed, 'invalid response parameter')
  
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
      const loginParam = UserDatatype.makeLoginParameters(
        userData.email,
        userData.password
      )
      const loginResposnse = await axios.post('user/login', loginParam)
      assert.ok(loginResposnse.status === 200, 'Falied to login...')
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
      const loginParam = UserDatatype.makeLoginParameters(
        userData.email,
        userData.password
      )
      const loginResposnse = await axios.post('user/login', loginParam)
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
      const noneParamRes = await axios.get('user/check', {
        param: {}
      })
      assert.ok(
        !noneParamRes.status.name && !noneParamRes.status.email,
        'failed to validate the none param...'
      )
    }

    {
      const exsitBothRes = await axios.get('user/check', {
        param: {
          name: userData.name,
          email: userData.email
        }
      })
      assert.ok(
        noneParamRes.status.name && noneParamRes.status.email,
        'failed to validate the none param...'
      )
    }

    {
      const nameRes = await axios.get('user/check', {
        param: {
          name: userData.name
        }
      })
      assert.ok(
        nameRes.status.name && !nameRes.status.email,
        'failed to validate the same name...'
      )
    }

    {
      const nameRes2 = await axios.get('user/check', {
        param: {
          name: userData.name,
          email: 'hoge@mail.com.com'
        }
      })
      assert.ok(
        nameRes2.status.name && !nameRes2.status.email,
        'failed to validate the same name at part 2...'
      )
    }

    {
      const emailRes = await axios.get('user/check', {
        param: {
          email: userData.email
        }
      })
      assert.ok(
        !emailRes.status.name && emailRes.status.email,
        'failed to validate the same email...'
      )
    }

    {
      const emailRes2 = await axios.get('user/check', {
        param: {
          name: 'aoajodjapodjwopjfepo',
          email: userData.email
        }
      })
      assert.ok(
        !emailRes2.status.name && emailRes2.status.email,
        'failed to validate the same email at part 2...'
      )
    }
  })
  // POST /user/signup with void parameters
  // POST /user/signup with invalid parameters

  // POST /user/login with void parameters
  // POST /user/login with invalid parameters

  // save to authToken

  // POST /user/logout without auth token

  // POST /user/delete without auth token
  // POST /user/delete without invalid auth token
]

Utils.run(tests, init)
