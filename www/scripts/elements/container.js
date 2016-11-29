'use strict'

const Element = require('../element')
const Log = require('../log')

const ContentFn = require('./container.pug')

class Container extends Element {

  constructor(contentFn = ContentFn) {
    super(false, contentFn)
  }

  // addContent(parentOrSelector = 'html > body', location = 'beforeend', data = {}, element) {
  //   Log.debug('- Container.addContent(%j, %j, data, element)', parentOrSelector, location)
  //   return super.addContent(parentOrSelector, location, {
  //     'contentElement': element,
  //     'contentData': data
  //   })
  // }

  // renderContent(element, data) {
  //   Log.debug('- Container.renderContent(element, data)')
  //   return super.renderContent({
  //     'contentElement': element,
  //     'contentData': data
  //   })
  // }

  // updateContent(element) {
  //   Log.debug('- Container.updateContent(element)')
  //   return super.updateContent({
  //     'content': element
  //   })
  // }

  bind() {}

  unbind() {}

}

module.exports = new Container()
