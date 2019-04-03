const path = require('path')
const fs = require('fs')
const consola = require('consola')
const moment = require('moment-timezone')
const commandLineArgs = require('command-line-args')

const optionDefinitions = [
  { name: 'files', type: String, multiple: true, defaultOption: true },
  { name: 'env', alias: 'e', type: String },
  { name: 'override', alias: 'o', type: Boolean },
  { name: 'all', alias: 'a', type: Boolean },
  { name: 'deleteAll', alias: 'd', type: Boolean }
]

const options = commandLineArgs(optionDefinitions)

// NODE_ENV defaults 'development' for protect to a invalid operation.
switch (options.env) {
  case 'production':
    process.env.NODE_ENV = 'production'
    break
  case 'test':
    process.env.NODE_ENV = 'test'
    break
  default:
    process.env.NODE_ENV = 'development'
    break
}

const database = require('../db/database')
const Questions = database.Questions
const QuestionType1 = database.QuestionType1
const Hints = database.Hints
const KanjiStrokes = database.KanjiStrokes

if (options.deleteAll) {
  const queryInterface = database.Sequelize.getQueryInterface()
  const pred = async () => {
    await Promise.all([
      queryInterface.bulkDelete('Questions', null),
      queryInterface.bulkDelete('QuestionType1s', null),
      queryInterface.bulkDelete('Hints', null),
      queryInterface.bulkDelete('KanjiStrokes', null)
    ])
    consola.success('complete delete all question and kanji.')
  }
  pred()
  return
}

if (options.all) {
  /**
   * 指定したディレクトリにある.jsファイルを取得する
   * @param {string} parentPath
   */
  const traverseFile = parentPath => {
    for (const filepath of fs.readdirSync(parentPath)) {
      const p = path.resolve(parentPath, filepath)
      const stat = fs.statSync(p)
      if (stat.isDirectory()) {
        traverseFile(p)
      } else if (filepath.search(/\.Q\.js$/) !== -1) {
        options.files.push(p)
      }
    }
  }

  options.files = []
  const root = fs.readdirSync(__dirname)
  for (const dirPath of root) {
    const p = path.resolve(__dirname, dirPath)
    const stat = fs.statSync(p)
    if (!stat.isDirectory()) {
      continue
    }
    traverseFile(p)
  }
}

if (!options.files) {
  consola.info('please input files in Q/. ex) node Q/createQ <filepath> ...')
  return
}

const utils = {
  /**
   * ファイルパスに合わせた日にち生成する
   * @param {string} filepath
   */
  getDate(filepath) {
    const dateElement = filepath.match(/(\d{4})\/(\d{2})\/(\d{2})/)
    return moment
      .tz(
        `${dateElement[1]}-${dateElement[2]}-${dateElement[3]} 00:00:00`,
        'Asia/Tokyo'
      )
      .format()
  },
  /**
   * @param {object} question
   */
  async createQuestion(question) {
    let answers = ''
    question.answers.forEach(element => {
      answers += element
    })

    let Q = await Questions.findOne({
      where: {
        show_date: question.date,
        date_id: question.dateId
      }
    })
    if (Q) {
      consola.info(
        `Question: update id=${Q.id} date=${Q.show_date} id=${Q.date_id} type=${
          Q.type
        }`
      )
      Q.setDataValue('show_date', question.date)
      Q.setDataValue('date_id', question.dateId)
      Q.setDataValue('type', question.type)
      await Q.save()
    } else {
      consola.info(
        `Question: create date=${question.date} dateId=${question.dateId}`
      )
      Q = await Questions.create({
        show_date: question.date,
        date_id: question.dateId,
        type: question.type
      })
    }

    let type1 = await QuestionType1.findOne({
      where: {
        question_id: Q.id
      }
    })
    if (type1) {
      consola.info(`Q Type1: update id=${Q.id}`)
      type1.setDataValue('question_id', Q.id)
      type1.setDataValue('description', question.description)
      type1.setDataValue('answers', answers)
      await type1.save()
    } else {
      consola.info(`Q Type1: create id=${Q.id}`)
      type1 = await QuestionType1.create({
        question_id: Q.id,
        description: question.description,
        answers: answers
      })
    }

    const instances = await Hints.findAll({
      where: {
        question_id: Q.id
      }
    })
    for (const index in question.hints) {
      const hint = question.hints[index]
      if (instances[index]) {
        consola.info(`Hints: update id=${Q.id} level=${index}`)
        instances[index].setDataValue('question_id', Q.id)
        instances[index].setDataValue('level', index)
        instances[index].setDataValue('text', hint)
        await instances[index].save()
      } else {
        consola.info(`Hints: create id=${Q.id} level=${index}`)
        instances[index] = await Hints.create({
          question_id: Q.id,
          level: index,
          text: hint
        })
      }
    }
    if (question.hints.length < instances.length) {
      for (
        let index = question.hints.length;
        index < instances.length;
        ++index
      ) {
        consola.info(`Hints: destroy id=${Q.id} level=${index}`)
        await instances[index].destroy({
          force: true
        })
      }
    }
  },
  /**
   * @param {object} kanji
   */
  async createKanjiStrokes(kanji) {
    const instances = await KanjiStrokes.findAll({
      where: {
        kanji: kanji.kanji
      },
      order: [['stroke_no', 'DESC']]
    })

    for (const index in kanji.strokes) {
      const stroke = kanji.strokes[index]
      if (instances[index]) {
        consola.info(
          `Kanji Strokes: update kanji=${
            kanji.kanji
          } No=${index} kind=${stroke}`
        )
        instances[index].setDataValue('stroke_kind', stroke)
        await instances[index].save()
      } else {
        consola.info(
          `Kanji Strokes: create kanji=${
            kanji.kanji
          } No=${index} kind=${stroke}`
        )
        instances[index] = await KanjiStrokes.create({
          kanji: kanji.kanji,
          stroke_kind: stroke,
          stroke_no: index
        })
      }
    }
    if (kanji.strokes.length < instances.length) {
      for (
        let index = kanji.strokes.length;
        index < instances.length;
        ++index
      ) {
        consola.info(`Kanji Strokes: destroy kanji=${kanji.kanji} No=${index}`)
        await instances[index].destroy({
          force: true
        })
      }
    }
  }
}

async function main() {
  for (const src of options.files) {
    const filepath = path.resolve(__dirname, src)
    const questionFile = require(filepath)

    consola.log(filepath)
    await questionFile.run(database, utils)
  }
}

main()
