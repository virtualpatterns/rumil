'use strict'

const Index = require('../../../index.json')
const Package = require('../../../package.json')
// const Timestamp = require('../../../cacheTimestamp.json')
const Process = require('../process')

class Status {

  static createRoutes(server) {

    server.head('/api/status', (request, response, next) => {
      response.send(200)
      next()
    })

    server.get('/api/status', (request, response, next) => {

      let memory = Process.memoryUsage()

      let status = {
        'name': Package.name,
        'now': new Date().toISOString(),
        'version': `${Package.version}-${Index.value}`,
        'heap': {
          'total': memory.heapTotal,
          'used': memory.heapUsed
        }
      }

      response.send(status)
      next()

    })

  }

}

module.exports = Status
