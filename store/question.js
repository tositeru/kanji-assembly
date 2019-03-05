import axios from 'axios'

export const state = () => ({
  currentQuestion: {
    corrected: false,
    date: null,
    dateId: -1,
    description: '',
    lines: [],
    hints: []
  },
  answers: []
})

export const mutations = {
  set(state, question) {
    state.currentQuestion.corrected = question.corrected
    state.currentQuestion.date = question.date
    state.currentQuestion.dateId = question.dateId
    state.currentQuestion.description = question.description
    state.currentQuestion.lines = question.lines
    state.currentQuestion.hints = question.hints
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
  }
}

function makeQuestionParam(date, dateId) {
  return {
    date: date,
    dateId: dateId
  }
}
function makeParam(question) {
  return makeQuestionParam(question.date, question.dateId)
}

export const actions = {
  // 日付から問題を取得する
  async query({ commit }, { date, dateId }) {
    const param = makeQuestionParam(date, dateId)
    const res = await axios.post('/Q', param)
    if (res.data === 'Bad') {
      return null
    }
    commit('set', res.data)
    return res.data
  },

  // 回答を送る
  async sendAnswer({ state, commit }, answers) {
    if (!state.currentQuestion) {
      return false
    }
    const Q = state.currentQuestion

    const param = makeParam(Q)
    param.answers = answers
    const res = await axios.post('/Q/answer', param)
    const result = res.data === 'OK'
    commit('setResult', result)
    return result
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
      const param = makeParam(Q)
      param.hintLevel = hintLevel
      const res = await axios.post('/Q/openHint', param)
      commit('setHintText', { level: hintLevel, text: res.data })
      return res.data
    } catch (err) {
      return false
    }
  }
}
