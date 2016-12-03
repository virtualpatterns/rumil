'use strict'

const Utilities = require('util')

const Log = require('../log')
const Path = require('../path')
const Process = require('../process')

class Authorize {

  static createRoutes(server) {

    server.head('/www/authorize/:system', (request, response, next) => {
      // Log.debug('- server.head(\'/www/authorize/:system\', (request, response, next) => { ... }')
      response.send(200)
      next()
    })

    server.get('/www/authorize/:system', (request, response, next) => {
      Log.debug('- server.get(\'/www/authorize/:system\', (request, response, next) => { ... }\n\n%s\n', Utilities.inspect(request.params))

      let authorizeModuleName = `${request.params.system.toLowerCase()}-authorize`
      let authorizeModulePath = Path.join(__dirname, 'systems', authorizeModuleName)

      Log.debug('-   authorizeModulePath=%j', Path.trim(authorizeModulePath))

      let authorizeModule = require(authorizeModulePath)

      let scopes = request.params.scopes ? request.params.scopes.split(',') : null

      Log.debug('-   scopes=%j', scopes || [])
      let authorize = new authorizeModule(scopes || [])

      if (!request.params.code) {

        let authorizeUri = authorize.getUri()

        Log.debug('-   authorizeUri=%j', authorizeUri)
        response.redirect(authorizeUri, next)

      }
      else {
        Log.debug('-   request.params.code=%j', request.params.code)

        authorize.getToken(request.url)
          .then(function (token) {

            Log.debug('-   token.accessToken=%j', token.accessToken)

            let authorizedUri = `/www/index.html?application=${encodeURI('./authorized-application.js')}&system=${encodeURI(request.params.system)}&token=${encodeURI(token.accessToken)}`

            Log.debug('-   authorizedUri=%j', authorizedUri)
            response.redirect(authorizedUri, next)

          })
          .catch((error) => {
            response.send(error)
            next()
          })

      }

    })

  }

}

module.exports = Authorize
