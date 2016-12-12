'use strict'

const OAuth = require('client-oauth2')
const Utilities = require('util')

const Log = require('../../log')
const SimpleAuthorization = require('./simple-authorization')

class OAuth2Authorization extends SimpleAuthorization {

  constructor(request, response, next) {
    super(request, response, next)
  }

  getAuthorizationId() {
    return this.request.params.state || super.getAuthorizationId()
  }

  getCode() {
    return this.request.params.code
  }

  getOptions() {

    let options = super.getOptions()

    return {
      'scopes': options.scopes ? options.scopes : [],
      'state': this.getAuthorizationId()
    }

  }

  *authorize(token = {}) {
    Log.debug('- OAuth2Authorization.*authorize(token) { ... }')

    let options = this.getOptions()
    Log.debug('-   options ...\n\n%s\n', Utilities.inspect(options))

    let oauth = new OAuth(options)

    if (!this.getCode())
      this.redirect(oauth.code.getUri())
    else {

      Log.debug('> oauth.code.getToken(%j)', this.request.url)
      let token = yield oauth.code.getToken(this.request.url)

      yield super.authorize(token.data)

    }

  }

}

module.exports = OAuth2Authorization
