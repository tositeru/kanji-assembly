export default context => {
  if (context.store.state.user.auth) {
    return context.redirect('/user')
  }
}
