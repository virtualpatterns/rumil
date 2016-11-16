'use strict'

const _Server = require('restify')
// const Utilities = require('util')

const Package = require('../../package.json')
const Path = require('./path')
const Process = require('./process')

let Server = Object.create(_Server)

Server.createServer = function(staticPath, modulesPath) {

  const Log = require('./handlers/log')
  const Static = require('./routes/static')
  const Status = require('./routes/status')

  let server = _Server.createServer.call(this, {
    'name': `${Package.name} v${Package.version}`
  })

  server.on('uncaughtException', (request, response, route, error) => {
    Log.error('- server.on(\'uncaughtException\', (request, response, route, error) => { ... })\n\n%s\n', error.stack)
    response.send(error)
  })

  Log.createHandlers(server)

  Static.createRoutes(server, staticPath, modulesPath)
  Status.createRoutes(server)

  return server

}

module.exports = Server
