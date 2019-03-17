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

  dispose() {
    this._predicate(this._target)
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
    for (const obj of this._disposeObjs) {
      await obj.dispose(obj)
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

  // テスト実行
  try {
    for (const test of tests) {
      consola.log(`Start ${test.name}`)
      await test.run()
      consola.success(`Success ${test.name}!!`)
    }
    consola.log('!!!Complete test!!!')
  } catch (error) {
    consola.error(error)
    consola.error(`Failed to tests...`)
  }
}

module.exports = {
  Test: Test,
  run: run
}
