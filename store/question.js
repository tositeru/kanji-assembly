import axios from 'axios'

export const state = () => ({
  currentQuestion: {
    corrected: false,
    date: null,
    date_id: -1,
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
    state.currentQuestion.date_id = question.date_id
    state.currentQuestion.description = question.description
    state.currentQuestion.lines = question.lines
    state.currentQuestion.hints = question.hints
  },
  setHintText(state, { id, text }) {
    state.currentQuestion.hints[id].opened = true
    state.currentQuestion.hints[id].text = text
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
  async openHint({ state, commit }, hintId) {
    if (!state.currentQuestion) {
      return false
    }
    const Q = state.currentQuestion
    if (hintId < 0 || hintId >= Q.hints.length) {
      return false
    }

    const param = makeParam(Q)
    param.hintId = hintId
    const res = await axios.post('/Q/openHint', param)
    if (res.status === 200) {
      commit('setHintText', { id: hintId, text: res.data })
      return res.data
    }
    return false
  }
}
