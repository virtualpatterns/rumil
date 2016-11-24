'use strict'

// const _Authorize = require('client-oauth2')
const Utilities = require('util')

const Log = require('../log')
const Path = require('../path')
const Process = require('../process')

class Authorize {

  constructor() {
  }

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

      Log.debug('- authorizeModulePath=%j', authorizeModulePath)

      let authorizeModule = require(authorizeModulePath)

      let scopes = request.params.scopes ? request.params.scopes.split(',') : null

      // Log.debug('> new authorizeModule(%j)', scopes || [])
      let authorize = new authorizeModule(scopes || [])

      if (!request.params.code) {

        let authorizeUri = authorize.getUri()

        // Log.debug('> response.redirect(%j, next)', authorizeUri)
        response.redirect(authorizeUri, next)

      }
      else {
        // Log.debug('> request.params.code=%j', request.params.code)

        authorize.getToken(request.url)
          .then(function (token) {

            // Log.debug('> token.accessToken=%j', token.accessToken)
            // Log.debug('> token.tokenType=%j', token.tokenType)

            // let authorizedUri = `/www/index.html?application=${encodeURI('./authorized-application.js')}&token=${encodeURI(token.accessToken)}&type=${encodeURI(token.tokenType)}`
            // let authorizedUri = scopes ? `/www/index.html?application=${encodeURI('./authorized-application')}&system=${encodeURI(request.params.system)}&scopes=${encodeURI(scopes.join(','))}&token=${encodeURI(token.accessToken)}` : `/www/index.html?application=${encodeURI('./authorized-application.js')}&system=${encodeURI(request.params.system)}&token=${encodeURI(token.accessToken)}`
            let authorizedUri = `/www/index.html?application=${encodeURI('./authorized-application.js')}&system=${encodeURI(request.params.system)}${scopes ? `&scopes=${encodeURI(scopes.join(','))}` : ``}&token=${encodeURI(token.accessToken)}`

            Log.debug('> response.redirect(%j, next)', authorizedUri)
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
