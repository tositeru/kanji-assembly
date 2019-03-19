import Cookie from 'js-cookie'
import cookieparser from 'cookieparser'

export default context => {
  let authToken = null
  if (process.server) {
    const headers = context.req.headers
    if (headers.cookie) {
      const parsed = cookieparser.parse(headers.cookie)
      authToken = parsed.auth
    }
  } else {
    authToken = Cookie.get('auth')
  }

  if (authToken !== context.store.state.user.auth) {
    context.store.commit('user/setAuthToken', authToken)
  }
}
