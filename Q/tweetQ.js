const path = require('path')
const fs = require('fs')
const consola = require('consola')
const moment = require('moment-timezone')
const Twitter = require('twitter')
const commandLineArgs = require('command-line-args')

const optionDefinitions = [
  { name: 'file', type: String, defaultOption: true },
  { name: 'validate', alias: 'v', type: Boolean },
  { name: 'part', alias: 'p', type: Number }
]

const options = commandLineArgs(optionDefinitions)

if (!process.env.TWITTER_CONSUMER_KEY) {
  consola.error('please set TWITTER_CONSUMER_KEY enviroment variable...')
  return 1
}
if (!process.env.TWITTER_CONSUMER_SECRET) {
  consola.error('please set TWITTER_CONSUMER_SECRET enviroment variable...')
  return 1
}
if (!process.env.TWITTER_ACCESS_TOKEN_KEY) {
  consola.error('please set TWITTER_ACCESS_TOKEN_KEY enviroment variable...')
  return 1
}
if (!process.env.TWITTER_ACCESS_TOKEN_SECRET) {
  consola.error('please set TWITTER_ACCESS_TOKEN_SECRET enviroment variable...')
  return 1
}

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
})

async function tweet(question, no, image) {
  try {
    const tweet = `#漢字組み立てパズル 今日の問題その${no}「${
      question.sentence
    }」${question.title} ${
      question.author
    } https://www.kanji-assembly.site #漢字 #パズル`
    if (tweet.length > 140) {
      consola.error(`over the tweet limit length... len=${tweet.length}`)
      consola.info(`tweet(${tweet.length}): ${tweet}`)
      return
    }

    if (options.validate) {
      consola.success('Success validation')
      consola.info(`tweet(${tweet.length}): ${tweet}`)
      return
    }

    const media = await client.post('media/upload', { media: image })

    const config = {
      status: tweet,
      media_ids: media.media_id_string
    }
    await client.post('statuses/update', config)
  } catch (error) {
    consola.error(error)
  }
}

function getQuestionFilePathAndDate(dateFilepath) {
  if (dateFilepath) {
    const [year, month, day] = dateFilepath.split(/[-\s\/]/)
    return {
      questionPath: path.resolve(__dirname, dateFilepath + '.Q'),
      year: year,
      month: month,
      day: day
    }
  } else {
    const [year, month, day] = moment()
      .format('YYYY-MM-DD')
      .split('-')
    return {
      questionPath: path.resolve(__dirname, year, month, day + '.Q'),
      year: year,
      month: month,
      day: day
    }
  }
}

// const question = require(path.resolve(__dirname, year, month, day + '.Q'));
const { questionPath, year, month, day } = getQuestionFilePathAndDate(
  options.file
)

const question = require(questionPath)

function tweetQuestion(question, year, month, day, part) {
  const imageFilepath = path.resolve(
    __dirname,
    `${year}/${month}/images/${year}-${month}-${day} part${part}.png`
  )
  const image = fs.readFileSync(imageFilepath)
  tweet(question, part, image)
}

if (typeof options.part === 'number') {
  if (!question.infos[options.part - 1]) {
    consola.error(
      `invalid part... part=${options.part},question=${JSON.stringify(
        question
      )}`
    )
    return
  }
  tweetQuestion(
    question.infos[options.part - 1],
    year,
    month,
    day,
    options.part
  )
} else {
  for (const index in question.infos) {
    const q = question.infos[index]
    const part = parseInt(index, 10) + 1
    tweetQuestion(q, year, month, day, part)
  }
}
