'use strict'

const Process = require('../../process')

const OAuth2Authorization = require('./oauth2-authorization')

class GoogleAuthorization extends OAuth2Authorization {

  constructor(request, response, next) {
    super(request, response, next)
  }

  getOptions() {
    return Object.assign({
      'clientId': Process.env.RUMIL_GOOGLE_PUBLIC_ID,
      'clientSecret': Process.env.RUMIL_GOOGLE_PRIVATE_ID,
      'accessTokenUri': 'https://www.googleapis.com/oauth2/v4/token',
      'authorizationUri': 'https://accounts.google.com/o/oauth2/v2/auth',
      'authorizationGrants': ['authorization_code'],
      'redirectUri': 'http://localhost:8081/api/authorize/Google',
    }, super.getOptions())
  }

}

module.exports = GoogleAuthorization
