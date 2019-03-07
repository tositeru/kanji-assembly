export default class QuestionDate {
  // date: 'YYYY-MM-DD;
  // id: integer
  constructor(date, id) {
    this._date = date
    this._id = id
  }
  get date() {
    return this._date
  }
  get id() {
    return this._id
  }

  set(date, id) {
    this._date = date
    this._id = id
  }
}
