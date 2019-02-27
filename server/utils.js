import path from 'path'

export default {
  // dirnameの位置に合わせたnuxt.config.jsのserverMiddlewareのパスを返す。
  // Return path for serverMiddleware in nuxt.config.js from 'dirname' path
  // dirname: string directory path in target file.
  makeMiddlewarePath: dirname => {
    const p = path.relative(path.resolve('server'), path.resolve(dirname))
    let middlewarePath = '/'
    for (const e of p.split(path.sep)) {
      middlewarePath += e + '/'
    }
    return middlewarePath
  }
}
