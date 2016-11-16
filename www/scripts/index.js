'use strict'

const Log = require('./log')

ons.ready(() => {
  Log.debug('- ons.ready(() => { ... })')

  const Timeout = require('timer-promise')

  const DefaultApplication = require('./applications/default-application')

  window.application = new DefaultApplication()
  window.application.addContent()

  Timeout.start('ons.ready', 0)
    .then(() => window.application.emitReady())

})

window.onerror = (message, file, line) => {
  Log.error('- window.onerror(message, file, line) => { ... }')
  Log.error('-   message=%j', message)
  Log.error('-   file=%j', file)
  Log.error('-   line=%j', line)
}
