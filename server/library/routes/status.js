'use strict'

const Co = require('co')
const Utilities = require('util')

const Configuration = require('../configuration')
// const Build = require('../../build.json')
const Log = require('../log')
const Package = require('../../../package.json')
const Process = require('../process')
const TwitterAuthorization = require('./systems/twitter-authorization')

class Status {

  static createRoutes(server) {

    server.head('/api/status', (request, response, next) => {
      response.send(200)
      next()
    })

    server.get('/api/status', Co.wrap(function* (request, response, next) {
      Log.debug('- server.get(\'/api/status\', Co.wrap(function* (request, response, next) => { ... })')

      try {

        let memory = Process.memoryUsage()

        let authorization = new TwitterAuthorization()
        authorization.open()

        try {

          let information = yield authorization.info()

          Log.debug('-   information ...\n\n%s\n', Utilities.inspect(information))

          let status = {
            'name': Package.name,
            'now': new Date().toISOString(),
            // 'version': `${Package.version}-${Build.value}`,
            'version': Package.version,
            'heap': {
              'total': memory.heapTotal,
              'used': memory.heapUsed
            },
            'storage': {
              'uri': Configuration.twitterStorageUri,
              'version': information.redis_version,
              'os': information.os
            }
          }

          response.send(status)
          next()

        }
        finally {
          authorization.close()
        }

      }
      catch (error) {
        Log.error('- server.get(\'/api/status\', Co.wrap(function* (request, response, next) => { ... })')
        Log.error('-   error.message=%j', error.message)
        Log.error('-   error.stack ...\n\n%s\n', error.stack)

        response.send(error)
        next()

      }

    }))

  }

}

module.exports = Status
