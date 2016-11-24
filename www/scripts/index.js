'use strict'

// const Queue = require('./update-content-queue')
const Search = require('query-string')
const Timeout = require('timer-promise')

const ApplicationContext = require.context('./applications', true, /-application\.js/)
const DefaultApplication = require('./applications/default-application')
// const Element = require('./element')
// const Interval = require('./interval')
const Log = require('./log')

ons.ready(() => {

  // try {

    Promise.resolve()
      .then(() => {

        let search = Search.parse(window.location.search)

        Log.debug('- ons.ready(() => { ... }) search.application=%j', search.application)

        window.application = search.application ? new (ApplicationContext(search.application))() : new DefaultApplication()
        window.application.addContent()
        window.application.addContentElement()

      })
      .then(() => Timeout.start('ons.ready', 0))
      .then(() => {
        window.application.emitReady()
      })
      .catch((error) => {
        Log.error('- ons.ready(() => { ... })')
        Log.error(error)
      })

    // let element = new Element(true)
    //
    // element.addContent()
    // element.addContentElement()

    // let queueFn = (index) => {
    //   return () => {
    //     return new Promise((resolve, reject) => {
    //       Log.debug('> ons.ready(() => { ... }) index=%j', index)
    //       Timeout.start('queueFn', 5000)
    //         .then(() => {
    //           Log.debug('< ons.ready(() => { ... }) index=%j', index)
    //           resolve()
    //         })
    //     })
    //   }
    // }

    // let a = () => {
    //   return new Promise((resolve, reject) => {
    //     Log.debug('> ons.ready(() => { ... }) index=0')
    //     Timeout.start('queueFn', 5000)
    //       .then(() => {
    //         Log.debug('< ons.ready(() => { ... }) index=0')
    //         resolve()
    //       })
    //   })
    // }
    //
    // let b = () => {
    //   return new Promise((resolve, reject) => {
    //     Log.debug('> ons.ready(() => { ... }) index=1')
    //     Timeout.start('queueFn', 5000)
    //       .then(() => {
    //         Log.debug('< ons.ready(() => { ... }) index=1')
    //         resolve()
    //       })
    //   })
    // }
    //
    // let c = () => {
    //   return new Promise((resolve, reject) => {
    //     Log.debug('> ons.ready(() => { ... }) index=2')
    //     Timeout.start('queueFn', 5000)
    //       .then(() => {
    //         Log.debug('< ons.ready(() => { ... }) index=2')
    //         resolve()
    //       })
    //   })
    // }

    // (queueFn(99))()

    // let queue = new Queue(1)
    //
    // queue.push(a)
    //   .catch((error) => {
    //     Log.error('- ons.ready(() => { ... })')
    //     Log.error(error)
    //   })
    //
    // queue.push(b)
    //   .catch((error) => {
    //     Log.error('- ons.ready(() => { ... })')
    //     Log.error(error)
    //   })
    //
    // queue.push(c)
    //   .catch((error) => {
    //     Log.error('- ons.ready(() => { ... })')
    //     Log.error(error)
    //   })

    // Promise.resolve()
    //   .then(() => {
    //
    //     queue.push(a))
    //       .catch((error) => {
    //         Log.error('- ons.ready(() => { ... })')
    //         Log.error(error)
    //       })
    //
    //     queue.push(b)
    //       .catch((error) => {
    //         Log.error('- ons.ready(() => { ... })')
    //         Log.error(error)
    //       })
    //
    //   })
    //   .then(() => queue.push(c))
    //   .catch((error) => {
    //     Log.error('- ons.ready(() => { ... })')
    //     Log.error(error)
    //   })

    // Promise.resolve()
    //   .then(() => Timeout.start('Queue.add(itemFn)', 1000))
    //   .then(() => queue.add(queueFn(1)))
    //   .then(() => Timeout.start('Queue.add(itemFn)', 1000))
    //   .then(() => queue.add(queueFn(2)))
    //   .then(() => Timeout.start('Queue.add(itemFn)', 1000))
    //   .then(() => queue.add(queueFn(3)))
    //   .then(() => Timeout.start('Queue.add(itemFn)', 1000))
    //   .then(() => queue.add(queueFn(4)))
    //   .then(() => Timeout.start('Queue.add(itemFn)', 1000))
    //   .then(() => queue.add(queueFn(5)))
    //   // .then(() => Timeout.start('queueFn', 1000))
    //   // .then(() => queue.add(queueFn(6)))
    //   // .then(() => Timeout.start('queueFn', 1000))
    //   // .then(() => queue.add(queueFn(7)))
    //   // .then(() => Timeout.start('queueFn', 1000))
    //   // .then(() => queue.add(queueFn(8)))
    //   // .then(() => Timeout.start('queueFn', 1000))
    //   // .then(() => queue.add(queueFn(9)))
    //   .catch((error) => {
    //     Log.error('- ons.ready(() => { ... })')
    //     Log.error(error)
    //   })

})

window.onerror = (message, file, line) => {
  Log.error('- window.onerror(message, file, line) => { ... }')
  Log.error('-   message=%j', message)
  Log.error('-   file=%j', file)
  Log.error('-   line=%j', line)
}
