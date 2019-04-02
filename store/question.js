import axios from 'axios'
import consola from 'consola'

export const state = () => ({
  currentDateUpdateNotifier: 1,
  currentDate: {
    date: null,
    dateId: -1
  },
  currentQuestion: {
    corrected: false,
    description: '',
    lines: [],
    hints: []
  },
  answers: [],
  hasQuestionLists: {}
})

function makeEmptyQuestion() {
  return {
    corrected: false,
    description: '',
    lines: [],
    hints: []
  }
}

export const mutations = {
  set(state, question) {
    state.currentQuestion.corrected = question.corrected
    state.currentQuestion.description = question.description
    state.currentQuestion.lines = question.lines
    state.currentQuestion.hints = question.hints
  },
  setQuestionDate(state, questionDate) {
    state.currentDate.date = questionDate.date
    state.currentDate.dateId = questionDate.dateId
    state.currentDateUpdateNotifier += 1
    // 念のために問題の日付が変わったら、問題データは無効化しておく。
    state.currentQuestion = makeEmptyQuestion()
  },
  setHintText(state, { level, text }) {
    const hint = state.currentQuestion.hints.find(hint => hint.level === level)
    if (hint) {
      hint.opened = true
      hint.text = text
    }
  },
  setAnswers(state, answers) {
    state.answers = answers
  },
  setResult(state, isOk) {
    state.currentQuestion.corrected = isOk
  },
  appendQuestionList(state, { month, list }) {
    state.hasQuestionLists[month] = list
  }
}

function makeQuestionParam(date, dateId) {
  return {
    date: date,
    dateId: dateId
  }
}
function makeParam(state) {
  return makeQuestionParam(state.currentDate.date, state.currentDate.dateId)
}

export const actions = {
  // 日付から問題を取得する
  async query({ commit }, { date, dateId }) {
    const param = makeQuestionParam(date, dateId)
    try {
      const res = await axios.post('/Q', param)
      if (res.data === 'Bad') {
        return null
      }
      commit('set', res.data)
      return res.data
    } catch (error) {
      return {
        failed: true,
        message: error.response.data.message || '問題を取得できませんでした'
      }
    }
  },

  // 回答を送る
  async sendAnswer({ state, commit }, answers) {
    if (!state.currentQuestion) {
      return false
    }

    const param = makeParam(state)
    param.answers = answers
    try {
      const res = await axios.post('/Q/answer', param)
      if (res.data.isCorrect) {
        const result = res.data.isCorrect
        commit('setResult', result)
        return result
      }
      return false
    } catch (error) {
      return false
    }
  },

  // ヒントパネルを開ける事をサーバーに告げる
  async openHint({ state, commit }, hintLevel) {
    if (!state.currentQuestion) {
      return false
    }
    const Q = state.currentQuestion
    if (!Q.hints.find(hint => hint.level === hintLevel)) {
      return false
    }

    try {
      const param = makeParam(state)
      param.hintLevel = hintLevel
      const res = await axios.post('/Q/openHint', param)
      commit('setHintText', { level: hintLevel, text: res.data })
      return res.data
    } catch (err) {
      return false
    }
  },

  async getListInMonth({ state, commit }, month) {
    if (state.hasQuestionLists[month]) {
      // 一回問い合わせていたら再び通信しないようにしている。
      // これがないと大量のHTTPリクエストが一気発行されてPCが落ちる
      return {
        doRequested: false,
        list: state.hasQuestionLists[month]
      }
    }
    // データ受信待ち
    state.hasQuestionLists[month] = {}
    try {
      const list = await axios.get('/Q/getListInMonth', {
        params: {
          month: month
        }
      })
      return {
        doRequested: true,
        list: list.data
      }
    } catch (err) {
      consola.error(err)
      return {
        doRequested: false,
        list: null
      }
    }
  }
}
