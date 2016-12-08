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

    server.get('/api/authorize/:system', (request, response, next) => {
      Log.debug('- server.get(\'/api/authorize/:system\', (request, response, next) => { ... }\n\n%s\n', Utilities.inspect(request.params))

      let authorizationModuleName = `${request.params.system.toLowerCase()}-authorization`
      let authorizationModulePath = Path.join(__dirname, 'systems', authorizationModuleName)

      // Log.debug('-   authorizationModulePath=%j', Path.trim(authorizationModulePath))

      const AuthorizationModule = require(authorizationModulePath)
      let authorizationModule = new AuthorizationModule(request, response, next)

      authorizationModule.authorize()

      // let scopes = request.params.scopes ? request.params.scopes.split(',') : null
      //
      // Log.debug('-   scopes=%j', scopes || [])
      // let authorization = new module(scopes || [])
      //
      // if (!request.params.code) {
      //
      //   let authorizationUri = authorization.getUri()
      //
      //   Log.debug('-   authorizationUri=%j', authorizationUri)
      //   response.redirect(authorizationUri, next)
      //
      // }
      // else {
      //   Log.debug('-   request.params.code=%j', request.params.code)
      //
      //   authorization.getToken(request.url)
      //     .then(function (token) {
      //
      //       Log.debug('-   token.accessToken=%j', token.accessToken)
      //
      //       let authorizedUri = `/www/index.html?application=${encodeURI('./authorized-application.js')}&system=${encodeURI(request.params.system)}&token=${encodeURI(token.accessToken)}`
      //
      //       Log.debug('-   authorizedUri=%j', authorizedUri)
      //       response.redirect(authorizedUri, next)
      //
      //     })
      //     .catch((error) => {
      //       response.send(error)
      //       next()
      //     })
      //
      // }

    })

  }

}

module.exports = Authorization
