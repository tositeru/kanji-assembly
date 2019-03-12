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

axios.defaults.baseURL = 'http://localhost:3003'
// axios.defaults.transformRequest = [
//   (data, headers)=>{
//     consola.log(headers, data)
//   }
// ]

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

function makeTest(name, testFunction) {
  return {
    name: name,
    func: testFunction
  }
}

const tests = [
  // 成功パターン
  makeTest('success pattern', async test => {
    const userData = {
      name: 'Tom',
      email: 'tom@mail.com',
      password: '1234567890'
    }

    // POST /user/signup with valid parameters
    // POST /user/signup/:token with valid parameters
    try {
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
    } catch (error) {
      assert.ok(false, `Failed to signup... ${error}`)
    }

    // POST /user/login with vaild parameters
    // POST /user/logout with auth token
    try {
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
    } catch (error) {
      assert.ok(false, `Failed to login/logout... ${error}`)
    }

    // DELETE /user/delete with auth token
    try {
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
    } catch (error) {
      assert.ok(false, `Failed to delete user... ${error}`)
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

async function run() {
  await init()

  // テスト実行
  try {
    for (const test of tests) {
      consola.log(`Start ${test.name}`)
      await test.func(test)
      consola.success(`Success ${test.name}!!`)
    }
  } catch (error) {
    consola.error(error)
    consola.error(`Failed to tests...`)
  }

  consola.log('!!!Complete test!!!')
}

run()
