'use strict'

const Package = require('../../../package.json')
const Timestamp = require('../../../cacheTimestamp.json')
const Process = require('../process')

let Status = Object.create({})

Status.createRoutes = function(server) {

  server.head('/api/status', (request, response, next) => {
    response.send(200)
    next()
  })

  server.get('/api/status', (request, response, next) => {

    let memory = Process.memoryUsage()

    let status = {
      'cacheTimestamp': Timestamp.value,
      'name': Package.name,
      'now': new Date().toISOString(),
      'version': Package.version,
      'heap': {
        'total': memory.heapTotal,
        'used': memory.heapUsed
      }
    }

    response.send(status)
    next()

  })

}

module.exports = Status
