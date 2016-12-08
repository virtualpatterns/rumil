// 'use strict'
//
// const OAuth = require('client-oauth2')
//
// const Process = require('../../process')
// const OAuth2Authorization = require('./simple-authorization')
//
// class GitHubAuthorization extends OAuth2Authorization {
//
//   constructor(request, response, next) {
//     super(request, response, next)
//
//     this.oauth = new OAuth({
//       'clientId': Process.env.RUMIL_GITHUB_PUBLIC_ID,
//       'clientSecret': Process.env.RUMIL_GITHUB_PRIVATE_ID,
//       'accessTokenUri': 'https://github.com/login/oauth/access_token',
//       'authorizationUri': 'https://github.com/login/oauth/authorize',
//       'authorizationGrants': ['credentials'],
//       'redirectUri': 'http://localhost:8080/api/authorize/GitHub',
//       'scopes': scopes
//     })
//
//   }
//
//   // getUri() {
//   //   return
//   // }
//   //
//   // getToken(uri) {
//   //   return this.code.getToken(uri)
//   // }
//
//   authorize() {
//     Log.debug('- GitHubAuthorization.authorize()')
//
//     if (!this.request.params.code) {
//
//       let authorizeUri = this.oauth.code.getUri()
//       Log.debug('-   authorizeUri=%j', authorizeUri)
//
//       this.response.redirect(authorizeUri, next)
//
//     }
//     else {
//       Log.debug('-   this.request.params.code=%j', this.request.params.code)
//
//       this.oauth.code.getToken(this.request.url)
//         .then(function (token) {
//
//           Log.debug('-   token.accessToken=%j', token.accessToken)
//
//           let authorizedUri = `/www/index.html?application=${encodeURI('./authorized-application.js')}&system=${encodeURI(this.request.params.system)}&token=${encodeURI(token.accessToken)}`
//
//           Log.debug('-   authorizedUri=%j', authorizedUri)
//           response.redirect(authorizedUri, next)
//
//         })
//         .catch((error) => {
//           response.send(error)
//           next()
//         })
//
//     }
//
//   }
//
// }
//
// module.exports = GitHubAuthorization

'use strict'

const Process = require('../../process')

const OAuth2Authorization = require('./oauth2-authorization')

class GitHubAuthorization extends OAuth2Authorization {

  constructor(request, response, next) {
    super(request, response, next)
  }

  getOptions() {
    return Object.assign({
      'clientId': Process.env.RUMIL_GITHUB_PUBLIC_ID,
      'clientSecret': Process.env.RUMIL_GITHUB_PRIVATE_ID,
      'accessTokenUri': 'https://github.com/login/oauth/access_token',
      'authorizationUri': 'https://github.com/login/oauth/authorize',
      'authorizationGrants': ['credentials'],
      'redirectUri': 'http://localhost:8080/api/authorize/GitHub',
      'scopes': []
    }, super.getOptions())
  }

}

module.exports = GitHubAuthorization
