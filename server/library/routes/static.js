'use strict'

const Server = require('restify')

const Path = require('../path')

const REGEXP_MOCHA = /^\/www\/vendor\/mocha\/(.*)$/
const REGEXP_STATIC = /^\/www\/(.*)$/

let Static = Object.create({})

Static.createRoutes = function(server, staticPath, modulesPath) {

  server.head('/favicon.ico', (request, response, next) => {
    response.send(200)
    next()
  })

  server.get('/favicon.ico', (request, response, next) => {
    Server.serveStatic({
      'directory': Path.join(staticPath, 'resources'),
      'file': `application.ico`,
      'maxAge': 0
    })(request, response, next)
  })

  server.head('/', (request, response, next) => {
    response.send(200)
    next()
  })

  server.get('/', (request, response, next) => {
    response.redirect('/www/index.html', next)
  })

  server.head('/www', (request, response, next) => {
    response.send(200)
    next()
  })

  server.get('/www', (request, response, next) => {
    response.redirect('/www/index.html', next)
  })

  server.head(REGEXP_MOCHA, (request, response, next) => {
    response.send(200)
    next()
  })

  server.get(REGEXP_MOCHA, (request, response, next) => {
    Server.serveStatic({
      'directory': Path.join(modulesPath, 'mocha'),
      'file': request.params[0],
      'maxAge': 0
    })(request, response, next)
  })

  server.head(REGEXP_STATIC, (request, response, next) => {
    response.send(200)
    next()
  })

  server.get(REGEXP_STATIC, (request, response, next) => {
    Server.serveStatic({
      'directory': staticPath,
      'file': request.params[0],
      'maxAge': 0
    })(request, response, next)
  })

}

module.exports = Static
