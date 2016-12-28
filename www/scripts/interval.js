'use strict'

const Log = require('./log')

const IntervalError = require('./errors/interval-error')

class Interval {

  static start(name, ...parameters) {
    return new Promise((resolve, reject) => {

      // Interval.start('name')
      // Interval.start('name', 10)
      // Interval.start('name', (index) => {})
      // Interval.start('name', 10, (index) => {})
      // Interval.start('name', 10, 1000, (index) => {})
      // Interval.start('name', 10, 1000, 1, (index) => {})

      let from = 10
      let every = 1000
      let decrement = 1
      let intervalFn = (index) => {
        // Log.debug('- Interval.start(%j, %j, %j, %j, intervalFn) index=%j', name, from, every, decrement, index)
      }

      switch (parameters.length) {
        case 0:
          break;
        case 1:
          if (Is.function(parameters[0]))
            intervalFn = parameters[0]
          else
            from = parameters[0]
          break;
        case 2:
          intervalFn = parameters[1]
          from = parameters[0]
          break;
        case 3:
          intervalFn = parameters[2]
          every = parameters[1]
          from = parameters[0]
          break;
        case 4:
          intervalFn = parameters[3]
          decrement = parameters[2]
          every = parameters[1]
          from = parameters[0]
          break;
        default:

      }

      Log.debug('- Interval.start(%j, %j, %j, %j, intervalFn)', name, from, every, decrement)

      Interval.stop(name)

      let interval = (Interval.intervals[name] = {
        'resolve': resolve,
        'reject': reject,
        'name': name,
        'from': from,
        'every': every,
        'decrement': decrement
      })

      interval.index = interval.from
      intervalFn(interval.index)

      interval.id = setInterval(() => {
        Log.debug('- Interval.start(%j, %j, %j, %j) interval.index=%j', name, from, every, decrement, interval.index)

        interval.index -= interval.decrement

        intervalFn(interval.index)

        if (interval.index <= 0) {
          // Interval.stop(interval.name)
          clearInterval(interval.id)
          delete Interval.intervals[interval.name]
          interval.resolve()
        }

      }, interval.every)

    })
  }

  static stop(name) {
    Log.debug('- Interval.stop(%j)', name)

    let interval = Interval.intervals[name]

    if (interval) {
      clearInterval(interval.id)
      delete Interval.intervals[interval.name]
      interval.reject(new IntervalError(`The interval "${interval.name}" was stopped.`))
    }

  }

}

Interval.intervals = {}

module.exports = Interval
