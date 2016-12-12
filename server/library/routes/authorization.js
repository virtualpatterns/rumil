'use strict'

const Co = require('co')
const Utilities = require('util')

const Log = require('../log')
const Path = require('../path')
const Process = require('../process')

class Authorization {

  static createRoutes(server) {

    server.head('/api/authorize/:system', (request, response, next) => {
      Log.debug('- server.head(\'/api/authorize/:system\', (request, response, next) => { ... }')
      response.send(200)
      next()
    })

    server.get('/api/authorize/:system', Co.wrap(function* (request, response, next) {
      Log.debug('- server.get(\'/api/authorize/:system\', Co.wrap(function* (request, response, next) => { ... })\n\n%s\n', Utilities.inspect(request.params))

      try {

        let authorizationModuleName = `${request.params.system.toLowerCase()}-authorization`
        let authorizationModulePath = Path.join(__dirname, 'systems', authorizationModuleName)

        // Log.debug('-   authorizationModulePath=%j', Path.trim(authorizationModulePath))

        const AuthorizationModule = require(authorizationModulePath)
        let authorizationModule = new AuthorizationModule(request, response, next)

        yield authorizationModule.authorize()

      }
      catch (error) {
        Log.error('- server.get(\'/api/authorize/:system\', Co.wrap(function* (request, response, next) => { ... })\n\n%s\n', Utilities.inspect(request.params))
        Log.error('-   error.message=%j', error.message)
        Log.error('-   error.stack ...\n\n%s\n', error.stack)

        response.send(error)
        next()

      }

    }))

  }

}

module.exports = Authorization
