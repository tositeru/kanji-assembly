const consola = require('consola')

/**
 * @class
 * for Test.run
 */
class Dispose {
  /**
   * @param {any} target
   * @param {function(any)} predicate
   */
  constructor(target, predicate) {
    this._target = target
    this._predicate = predicate
  }

  async dispose() {
    await this._predicate(this._target)
  }
}

/**
 * One test unit
 * @class
 */
class Test {
  /**
   * constructor
   * @param {string} name
   * @param {function(Test)} testBody
   */
  constructor(name, testBody) {
    this._name = name
    this._testBody = testBody
    this._disposeObjs = []
  }

  get name() {
    return this._name
  }

  /**
   * run test
   */
  async run() {
    await this._testBody(this)
  }

  /**
   *
   */
  async dispose() {
    if (this._disposeObjs.length <= 0) {
      return
    }
    consola.log(`postprocess ${this._name}`)
    for (const obj of this._disposeObjs) {
      await obj.dispose()
    }
  }

  /**
   * push postproccess target
   * @param {any} [data]
   * @param {function(Object)} [predicate] predicate must receive to argument 'data'.
   */
  pushDisposeObject(data, predicate) {
    this._disposeObjs.push(new Dispose(data, predicate))
  }
}

/**
 * テスト実行
 * @param {Array<Test>} test
 * @param {async function()} initFunc
 */
async function run(tests, initFunc) {
  await initFunc()

  const failedTests = []
  // テスト実行
  for (const test of tests) {
    try {
      consola.info(`--- Start ${test.name} ---`)
      await test.run()
      consola.success(`Pass ${test.name}!!`)
    } catch (error) {
      failedTests.push(test)
      consola.error(error)
      consola.error(`Failed to '${test.name}'...`)
    }
    await test.dispose()
  }

  const result = `success=${tests.length - failedTests.length},fail=${
    failedTests.length
  }`
  if (failedTests.length > 0) {
    consola.error('Failed tests...', result)
    for (const t of failedTests) {
      consola.error(`-- ${t.name}`)
    }
  } else {
    consola.success('!!!Complete test!!!', result)
  }
}

module.exports = {
  Test: Test,
  run: run,

  /**
   * 渡したオブジェクトに指定した名前と型のプロパティが存在するか確認する
   * @param {Object} obj
   * @param {Array<Array<string>>} propNames 要素は0番目に名前、1番目に型名が入る
   */
  doExistPropertys: (obj, propNames) => {
    if (obj) {
      return false
    }
    for (const prop of propNames) {
      if (!obj[prop[0]] || toString.call(obj[prop[0]]) !== prop[1]) {
        return false
      }
    }
    return true
  }
}
