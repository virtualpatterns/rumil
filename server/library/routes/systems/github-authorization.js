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
    }, super.getOptions())
  }

}

module.exports = GitHubAuthorization
