'use strict'

const Configuration = require('../../configuration')

const OAuth2Authorization = require('./oauth2-authorization')

class GitHubAuthorization extends OAuth2Authorization {

  constructor(request, response, next) {
    super(request, response, next)
  }

  getOptions() {
    return Object.assign({
      'clientId': Configuration.gitHubPublicKey,
      'clientSecret': Configuration.gitHubPrivateKey,
      'accessTokenUri': 'https://github.com/login/oauth/access_token',
      'authorizationUri': 'https://github.com/login/oauth/authorize',
      'authorizationGrants': ['credentials'],
      'redirectUri': Configuration.gitHubRedirectUri,
    }, super.getOptions())
  }

}

module.exports = GitHubAuthorization
