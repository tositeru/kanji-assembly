export const STATUS = {
  LOADING: 'loading',
  MAIN: 'main-form',
  JUDGING: 'juding',
  RESULT: 'result',
  HINT: 'hint',
  UNKNOWN: 'unknown',
  validateStatus(status) {
    for (const key in STATUS) {
      if (STATUS[key] === status) return true
    }
    return false
  }
}
