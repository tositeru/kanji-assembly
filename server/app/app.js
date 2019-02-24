import express from 'express'
import { resolve } from 'dns';
import utils from '../utils.js'

const app = express()

app.get('/', function(req, res){
  res.send('HOGE FOO bar')
})

export default {
  path: utils.makeMiddlewarePath(__dirname),
  handler: app,
}
