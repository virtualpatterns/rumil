'use strict'

const Co = require('co')
// const Promisify = require("es6-promisify")
// const Redis = require("redis")
// const Parser = require('redis-info')

const Index = require('../../../index.json')
const Package = require('../../../package.json')
const Process = require('../process')

class Status {

  static createRoutes(server) {

    server.head('/api/status', (request, response, next) => {
      response.send(200)
      next()
    })

    server.get('/api/status', Co.wrap(function* (request, response, next) {

      let memory = Process.memoryUsage()

      // let storage = Process.env.RUMIL_TWITTER_STORAGE_URL ? Redis.createClient(Process.env.RUMIL_TWITTER_STORAGE_URL) : Redis.createClient()
      //
      // storage.Promise = {}
      // storage.Promise.info = Promisify(storage.info, storage)
      //
      // let storageInformation = Parser.parse(yield storage.info())

      let status = {
        'name': Package.name,
        'now': new Date().toISOString(),
        'version': `${Package.version}-${Index.value}`,
        'heap': {
          'total': memory.heapTotal,
          'used': memory.heapUsed
        }
        // ,
        // 'storage': {
        //   'uri': Process.env.RUMIL_TWITTER_STORAGE_URL,
        //   'version': storageInformation.redis_version,
        //   'os': storageInformation.os
        // }
      }

      response.send(status)
      next()

    }))

  }

}

module.exports = Status
