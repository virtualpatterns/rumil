'use strict'

const Process = process

module.exports = function(Configuration) {

  return {
    // GitHub configuration
    'gitHubPublicKey': Process.env.RUMIL_GITHUB_PUBLIC_KEY,
    'gitHubPrivateKey': Process.env.RUMIL_GITHUB_PRIVATE_KEY,
    'gitHubRedirectUri': 'http://localhost:8081/api/authorize/github',
    // Google configuration
    'googlePublicKey': Process.env.RUMIL_GOOGLE_PUBLIC_KEY,
    'googlePrivateKey': Process.env.RUMIL_GOOGLE_PRIVATE_KEY,
    'googleRedirectUri': 'http://localhost:8081/api/authorize/google',
    // Twitter configuration
    'twitterStorageUri': false, // use default ... redis://localhost:6379/0
    'twitterStorageOptions': {},
    'twitterPublicKey': Process.env.RUMIL_TWITTER_PUBLIC_KEY,
    'twitterPrivateKey': Process.env.RUMIL_TWITTER_PRIVATE_KEY,
    'twitterRedirectUri': 'http://localhost:8081/api/authorize/twitter',
  }

}
