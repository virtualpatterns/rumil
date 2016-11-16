 'use strict'

const Emitter = require('event-emitter')

const Application = require('../application')
const Log = require('../log')
const NavigatedAutomation = require('./navigated-automation')
const NavigatedSelection = require('./navigated-selection')

const ContentFn = require('./navigated-application.pug')

class NavigatedApplication extends Application {

  constructor(contentFn = ContentFn) {
    super(contentFn)

    this.pages = []
    this.pages.last = () => this.pages[this.pages.length - 1]

  }

  emitPageShown(page, isInitial) {
    // Log.debug('- NavigatedApplication.emitPageShown(page, %s) page.id=%j', isInitial, page.id)
    this.emitEvent('pageShown', page, isInitial)
  }

  emitPageHidden(page, isFinal) {
    // Log.debug('- NavigatedApplication.emitPageHidden(page, %s) page.id=%j', isFinal, page.id)
    this.emitEvent('pageHidden', page, isFinal)
  }

  bindEvents() {
    super.bindEvents()

    this.getContent().addEventListener('init', this._onInit = this.onInit.bind(this))
    // this.getContent().addEventListener('show', this._onPageShown = this.onPageShown.bind(this))
    // this.getContent().addEventListener('hide', this._onPageHidden = this.onPageHidden.bind(this))
    this.getContent().addEventListener('destroy', this._onDestroy = this.onDestroy.bind(this))

    this.onEvent('pageShown', this._onPageShown = this.onPageShown.bind(this))
    this.onEvent('pageHidden', this._onPageHidden = this.onPageHidden.bind(this))

  }

  unbindEvents() {

    this.offEvent('pageHidden', this._onPageHidden)
    this.offEvent('pageShown', this._onPageShown)

    this.getContent().removeEventListener('destroy', this._onDestroy)
    // this.getContent().removeEventListener('hide', this._onPageHidden)
    // this.getContent().removeEventListener('show', this._onPageShown)
    this.getContent().removeEventListener('init', this._onPageAdded)

    super.unbindEvents()
  }

  onInit(event) {
    Log.debug('- NavigatedApplication.onInit() event.target.id=%j', event.target.id)
    this.pages.last().addContentElement()
    this.pages.last().bindEvents()
  }

  onDestroy(event) {
    Log.debug('- NavigatedApplication.onDestroy() event.target.id=%j', event.target.id)
    this.pages.last().unbindEvents()
    this.pages.last().removeContentElement()
  }

  onPageShown(page, isInitial) {
    // Log.debug('- NavigatedApplication.onPageShown(page, %s) page.id=%j', isInitial, page.id)
    page.emitShown(isInitial)
  }

  onPageHidden(page, isFinal) {
    // Log.debug('- NavigatedApplication.onPageHidden(page, %s) page.id=%j', isFinal, page.id)
    page.emitHidden(isFinal)
  }

  pushPage(page, options = {
    'animation': 'slide'
  }) {
    // Log.debug('- NavigatedApplication.pushPage(page, options)\n%s\n\n', page.renderContent())
    Log.debug('- NavigatedApplication.pushPage(page, options)')

    let hiddenPage = this.pages.last()
    let shownPage = page

    this.pages.push(shownPage)

    return this.getContent().pushPage(null, {
      'pageHTML': shownPage.renderContent(),
      'animation': options.animation,
      'animationOptions': options.animationOptions,
      'data': options.data
    })
      .then(() => {

        // throw new Error('You suck!')

        if (hiddenPage)
          this.emitPageHidden(hiddenPage, false)

        this.emitPageShown(shownPage, true)

        return Promise.resolve(shownPage)

      })
      // .catch((error) => Promise.reject(error))

  }

  canPopPage() {
    return this.pages.length > 1
  }

  popPage(options = {
    'animation': 'slide'
  }) {
    Log.debug('- NavigatedApplication.popPage(options)')

    if (this.canPopPage()) {

      return this.getContent().popPage({
        'animation': options.animation,
        'animationOptions': options.animationOptions
      })
        .then(() => {

          let hiddenPage = this.pages.pop()
          let shownPage = this.pages.last()

          this.emitPageHidden(hiddenPage, true)
          this.emitPageShown(shownPage, false)

          return Promise.resolve(hiddenPage)

        })
        // .catch((error) => Promise.reject(error))

    }
    else
      return Promise.reject(new RangeError('The last page on the stack cannot be removed.'))

  }

  // replacePage(options) {}

}

NavigatedApplication.Automation = NavigatedAutomation
NavigatedApplication.Selection = NavigatedSelection

module.exports = NavigatedApplication
