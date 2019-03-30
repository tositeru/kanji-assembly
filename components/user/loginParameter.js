export default {
  getEmail() {
    if (!(window && window.localStorage)) {
      return ''
    }
    const localStorage = window.localStorage
    const email = localStorage.getItem('email')
    if (typeof email !== 'string') {
      return ''
    }
    return email
  },
  getPassword() {
    if (!(window && window.localStorage)) {
      return ''
    }
    const localStorage = window.localStorage
    const password = localStorage.getItem('password')
    if (typeof password !== 'string') {
      return ''
    }
    return password
  }
}
