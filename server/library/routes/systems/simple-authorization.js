'use strict'

const Utilities = require('util')

const Log = require('../../log')

class SimpleAuthorization {

  constructor(request, response, next) {
    // Log.debug('- SimpleAuthorization(request, response, next)')
    this.request = request
    this.response = response
    this.next = next
  }

  getAuthorizationId() {
    return this.request.params.authorizationId
  }

  redirect(uri) {
    Log.debug('- SimpleAuthorization.redirect(%j) { ... }', uri)
    this.response.redirect(uri, this.next)
  }

  sendError(error) {
    Log.debug('- SimpleAuthorization.sendError(error) { ... }')
    Log.error('-   error.message=%j', error.message)
    Log.error('-   error.stack ...\n\n%s\n', error.stack)

    this.response.send(error)
    this.next()

  }

  authorize(token = {}) {
    Log.debug('- SimpleAuthorization.authorize(token) { ... }\n\n%s\n', Utilities.inspect(token))
    this.redirect(`/www/index.html?application=${encodeURI('./authorized-application.js')}&authorizationId=${encodeURI(this.getAuthorizationId())}&token=${encodeURI(JSON.stringify(token))}`)
  }

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
  //
  //   })
  //
  // }

}

module.exports = SimpleAuthorization
