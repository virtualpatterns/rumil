'use strict'

const Authorize = require('client-oauth2')

const Log = require('../../log')
const Process = require('../../process')

class GoogleAuthorize extends Authorize {

  constructor(scopes = []) {
    super({
      'clientId': Process.env.RUMIL_GOOGLE_PUBLIC_ID,
      'clientSecret': Process.env.RUMIL_GOOGLE_PRIVATE_ID,
      'accessTokenUri': 'https://www.googleapis.com/oauth2/v4/token',
      'authorizationUri': 'https://accounts.google.com/o/oauth2/v2/auth',
      'authorizationGrants': ['authorization_code'],
      'redirectUri': 'http://localhost:8080/www/authorize/Google',
      'scopes': scopes
    })
  }

  getUri() {
    return this.code.getUri()
  }

  getToken(uri) {
    return this.code.getToken(uri)
  }

}

module.exports = GoogleAuthorize
