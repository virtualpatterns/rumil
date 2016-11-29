 'use strict'

const Search = require('query-string')

const Application = require('../application')
const Log = require('../log')
const NavigatedAutomation = require('./navigated-automation')
const NavigatedSelect = require('./navigated-select')
const PageContext = require.context('../elements/pages', true, /-page\.js/)

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

  bind() {
    super.bind()

    // this.getContent().addEventListener('init', this._onInit = this.onInit.bind(this))
    // this.getContent().addEventListener('show', this._onPageShown = this.onPageShown.bind(this))
    // this.getContent().addEventListener('hide', this._onPageHidden = this.onPageHidden.bind(this))
    // this.getContent().addEventListener('destroy', this._onDestroy = this.onDestroy.bind(this))

    this.onEvent('pageShown', this._onPageShown = this.onPageShown.bind(this))
    this.onEvent('pageHidden', this._onPageHidden = this.onPageHidden.bind(this))

  }

  unbind() {

    this.offEvent('pageHidden', this._onPageHidden)
    this.offEvent('pageShown', this._onPageShown)

    // this.getContent().removeEventListener('destroy', this._onDestroy)
    // this.getContent().removeEventListener('hide', this._onPageHidden)
    // this.getContent().removeEventListener('show', this._onPageShown)
    // this.getContent().removeEventListener('init', this._onPageAdded)

    super.unbind()
  }

  onReady(Page) {

    // try {

      // super.onReady()
      //
      // let search = Search.parse(window.location.search);
      //
      // Log.debug('- NavigatedApplication.onReady() search.page=%j', search.page);

      Promise.resolve()
        .then(() => {
          super.onReady()

          let search = Search.parse(window.location.search);

          // Log.debug('- NavigatedApplication.onReady() search.page=%j', search.page);

          return Promise.resolve(search.page ? PageContext(search.page) : Page)

        })
        .then((Page) => Promise.resolve(new Page()))
        .then((page) => this.pushPage(page))
        .catch((error) => window.application.showError(error))

    // }
    // catch (error) {
    //   window.application.showError(error)
    // }

  }

  onInit(event) {
    // Log.debug('- NavigatedApplication.onInit() event.target.id=%j', event.target.id)
    // this.pages.last().addContentElement()
    // this.pages.last().bind()
  }

  onDestroy(event) {
    // Log.debug('- NavigatedApplication.onDestroy() event.target.id=%j', event.target.id)
    // this.pages.last().unbind()
    // this.pages.last().removeContentElement()
  }

  onPageShown(page, isInitial) {
    // Log.debug('- NavigatedApplication.onPageShown(page, %s) page.id=%j', isInitial, page.id)

    page.addContentElement()
    page.bind()

    page.emitShown(isInitial)

  }

  onPageHidden(page, isFinal) {
    // Log.debug('- NavigatedApplication.onPageHidden(page, %s) page.id=%j', isFinal, page.id)

    page.emitHidden(isFinal)

    page.unbind()
    page.removeContentElement()

  }

  pushPage(page, options = {
    'animation': 'slide'
  }) {
    return Promise.resolve()
      .then(() => {
        // Log.debug('- NavigatedApplication.pushPage(page, options)\n%s\n\n', page.renderContent())
        Log.debug('- NavigatedApplication.pushPage(page, options)')

        let hiddenPage = this.pages.last()
        let shownPage = page

        this.pages.push(shownPage)

        if (hiddenPage)
          this.emitPageHidden(hiddenPage, false)

        return this.getContent().pushPage(null, {
          'pageHTML': shownPage.renderContent(),
          'animation': options.animation,
          'animationOptions': options.animationOptions,
          'data': options.data
        })
          .then(() => {

            this.emitPageShown(shownPage, true)

            return Promise.resolve(shownPage, hiddenPage)

          })

      })
  }

  canPopPage() {
    return this.pages.length > 1
  }

  popPage(options = {
    'animation': 'slide'
  }) {
    return Promise.resolve()
      .then(() => {
        Log.debug('- NavigatedApplication.popPage(options)')

        if (this.canPopPage()) {

          let hiddenPage = this.pages.pop()
          let shownPage = this.pages.last()

          this.emitPageHidden(hiddenPage, true)

          return this.getContent().popPage({
            'animation': options.animation,
            'animationOptions': options.animationOptions
          })
            .then(() => {

              this.emitPageShown(shownPage, false)

              return Promise.resolve(hiddenPage, shownPage)

            })

        }
        else
          return Promise.reject(new RangeError('The last page on the stack cannot be removed.'))

      })
  }

}

NavigatedApplication.Automation = NavigatedAutomation
NavigatedApplication.Select = NavigatedSelect

module.exports = NavigatedApplication
