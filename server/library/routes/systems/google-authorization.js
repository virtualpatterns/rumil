// 'use strict'
//
// const Authorization = require('client-oauth2')
//
// const Log = require('../../log')
// const Process = require('../../process')
//
// class GoogleAuthorization extends Authorization {
//
//   constructor(scopes = []) {
//     super({
//       'clientId': Process.env.RUMIL_GOOGLE_PUBLIC_ID,
//       'clientSecret': Process.env.RUMIL_GOOGLE_PRIVATE_ID,
//       'accessTokenUri': 'https://www.googleapis.com/oauth2/v4/token',
//       'authorizationUri': 'https://accounts.google.com/o/oauth2/v2/auth',
//       'authorizationGrants': ['authorization_code'],
//       'redirectUri': 'http://localhost:8080/api/authorize/Google',
//       'scopes': scopes
//     })
//   }
//
//   getUri() {
//     return this.code.getUri()
//   }
//
//   getToken(uri) {
//     return this.code.getToken(uri)
//   }
//
// }
//
// module.exports = GoogleAuthorization

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
      'redirectUri': 'http://localhost:8080/api/authorize/Google',
      'scopes': [ 'profile' ]
    }, super.getOptions())
  }

}

module.exports = GoogleAuthorization
