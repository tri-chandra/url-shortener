'use strict'

require('./check-versions')()

var fs = require('fs')
var util = require('util')
var log_file = fs.createWriteStream(__dirname + '/../activity_'+new Date().toISOString().split(':').join('_')+'.log', {flags : 'w'})
var log_stdout = process.stdout

console.log = function(d) {
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
}

const config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

const opn = require('opn')
const path = require('path')
const express = require('express')
const webpack = require('webpack')
const proxyMiddleware = require('http-proxy-middleware')
const webpackConfig = process.env.NODE_ENV === 'testing'
  ? require('./webpack.prod.conf')
  : require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
const port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
const autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
const proxyTable = config.dev.proxyTable

const bodyParser = require('body-parser')
const api = require('../src/api')
const redis = require('redis')
var rdClient = redis.createClient()

const app = express()
const compiler = webpack(webpackConfig)

const devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

const hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: false
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

app.use(bodyParser.json())

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  let options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

/**
 * Start: Custom Code
 */
app.use(function(req, res, next) {
  if (req.method === 'POST') {
    api.route(rdClient, req).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.send(err)
    })
  } else if (req.originalUrl==='/' || req.originalUrl === '/app.js' || req.originalUrl.startsWith('/static/')) {
    next()
  } else {
    api.lenghten(rdClient, req.originalUrl.substring(1)).then((response) => {
      res.redirect(response)
    }).catch((err) => {
      res.redirect('/#/404')
    })
  }
})

/**
 * End: Custom Code
 */

// serve webpack bundle output
app.use(devMiddleware)

// serve pure static assets
const staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

const uri = 'http://localhost:' + port

let _resolve
const readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

const server = app.listen(port)

process.on('uncaughtException', function(err) {
  console.log(err)
})

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
