'use strict'

const Configuration = require('../../configuration')

const OAuth2Authorization = require('./oauth2-authorization')

class GoogleAuthorization extends OAuth2Authorization {

  constructor(request, response, next) {
    super(request, response, next)
  }

  getOptions() {
    return Object.assign({
      'clientId': Configuration.googlePublicKey,
      'clientSecret': Configuration.googlePrivateKey,
      'accessTokenUri': 'https://www.googleapis.com/oauth2/v4/token',
      'authorizationUri': 'https://accounts.google.com/o/oauth2/v2/auth',
      'authorizationGrants': ['authorization_code'],
      'redirectUri': Configuration.googleRedirectUri
    }, super.getOptions())
  }

}

module.exports = GoogleAuthorization
