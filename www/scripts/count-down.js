'use strict'

const Log = require('./log')
const Interval = require('./interval')

class CountDown {

  static start(element, selector, from, every = 1000, decrement = 1) {

    return Promise.resolve()
      .then(() => {
        Log.debug('- CountDown.start(element, %j, %j, %j, %j) element.id=%j', selector, from, every, decrement, element.id)

        return Interval.start(`#${element.id} ${selector}`, from, every, decrement, (indexNumber) => {
          Log.debug('- CountDown.start(element, %j, %j, %j, %j) element.id=%j indexNumber=%j', selector, from, every, decrement, element.id, indexNumber)

          let indexElement = element.getContent().querySelector(selector)

          if (indexElement)
            indexElement.innerHTML = indexNumber
          else
            Log.error('- CountDown.start(element, %j, %j, %j, %j) element.id=%j indexNumber=%j indexElement=%j', selector, from, every, decrement, element.id, indexNumber, indexElement)

        })

      })

  }

  static stop(element, selector) {
    Log.debug('- CountDown.stop(element, %j) element.id=%j', selector, element.id)
    Interval.stop(`#${element.id} ${selector}`)
  }

}

module.exports = CountDown
