'use strict'

const Assert = require('assert')
const Co = require('co')

const DefaultAutomation = require('../applications/default-automation')
const DefaultPage = require('../elements/pages/default-page')

describe('DefaultPage', () => {

  before(() => {
    return DefaultAutomation.whenPageShown(() => {
      window.application.pushPage(new DefaultPage())
    })
  })

  it('should contain the title Features', () => {
    Assert.equal(DefaultAutomation.getToolbarText(), 'Features')
  })

  // it('should contain an item for Pop', () => {
  //   Assert.equal(DefaultAutomation.existsListItem('Pop'), true)
  // })

  it('should contain an item for Status', () => {
    Assert.equal(DefaultAutomation.existsListItem('Status'), true)
  })

  it('should contain an item for Updates', () => {
    Assert.equal(DefaultAutomation.existsListItem('Updates'), true)
  })

  it('should contain an item for Tests', () => {
    Assert.equal(DefaultAutomation.existsListItem('Tests'), true)
  })

  it('should contain an item for Coverage', () => {
    Assert.equal(DefaultAutomation.existsListItem('Coverage'), true)
  })

  it('should contain an item for Countdown ...', () => {
    Assert.equal(DefaultAutomation.existsListItem('Countdown'), true)
  })

  it('should contain an item for Alert', () => {
    Assert.equal(DefaultAutomation.existsListItem('Alert'), true)
  })

  it('should contain an item for Confirmation', () => {
    Assert.equal(DefaultAutomation.existsListItem('Confirmation'), true)
  })

  it('should contain an item for Spinner', () => {
    Assert.equal(DefaultAutomation.existsListItem('Spinner'), true)
  })

  it('should contain an item for GitHub', () => {
    Assert.equal(DefaultAutomation.existsListItem('GitHub'), true)
  })

  // describe('(when the item for Pop is clicked)', () => {
  //
  //   let dialog = null
  //
  //   before(() => {
  //     return DefaultAutomation.whenDialogShown(() => {
  //       DefaultAutomation.clickListItem('Pop')
  //     })
  //       .then((_dialog) => {
  //         dialog = _dialog
  //       })
  //   })
  //
  //   it('should show an alert dialog with the text The last page on the stack cannot be removed.', () => {
  //     Assert.equal(DefaultAutomation.getAlertText(), 'The last page on the stack cannot be removed.')
  //   })
  //
  //   after(() => {
  //     return DefaultAutomation.whenDialogHidden(() => {
  //       window.application.hideDialog(dialog)
  //     })
  //   })
  //
  // })

  describe('(when the item for Status is clicked)', () => {

    before(() => {
      return DefaultAutomation.whenPageShown(() => {
        DefaultAutomation.clickListItem('Status')
      })
    })

    it('should contain the title Status', () => {
      Assert.equal(DefaultAutomation.getToolbarText(), 'Status')
    })

    after(() => {
      return DefaultAutomation.whenPageShown(() => {
        window.application.popPage()
      })
    })

  })

  describe('(when the item for Status and the Features button are clicked)', () => {

    // before(() => {
    //   return Promise.resolve()
    //     .then(() => DefaultAutomation.whenPageShown(() => {
    //       DefaultAutomation.clickListItem('Status')
    //       }
    //     ))
    //     .then(() => DefaultAutomation.whenPageShown(() => {
    //       DefaultAutomation.clickToolbarButton('Features')
    //       }
    //     ))
    // })

    before(Co.wrap(function* () {

        yield DefaultAutomation.whenPageShown(() => {
          DefaultAutomation.clickListItem('Status')
          }
        )

        yield DefaultAutomation.whenPageShown(() => {
          DefaultAutomation.clickToolbarButton('Features')
          }
        )

    }))

    it('should contain the title Features', () => {
      Assert.equal(DefaultAutomation.getToolbarText(), 'Features')
    })

  })

  describe('(when the item for Updates is clicked)', () => {

    before(() => {
      return DefaultAutomation.whenPageShown(() => {
        DefaultAutomation.clickListItem('Updates')
      })
    })

    it('should contain the title Updates', () => {
      Assert.equal(DefaultAutomation.getToolbarText(), 'Updates')
    })

    after(() => {
      return DefaultAutomation.whenPageShown(() => {
        window.application.popPage()
      })
    })

  })

  describe('(when the item for Updates and the Features button are clicked)', () => {

    before(Co.wrap(function* () {

        yield DefaultAutomation.whenPageShown(() => {
          DefaultAutomation.clickListItem('Updates')
          }
        )

        yield DefaultAutomation.whenPageShown(() => {
          DefaultAutomation.clickToolbarButton('Features')
          }
        )

    }))

    it('should contain the title Features', () => {
      Assert.equal(DefaultAutomation.getToolbarText(), 'Features')
    })

  })

  describe('(when the item for Alert is clicked)', () => {

    let dialog = null

    // before(() => {
    //   return DefaultAutomation.whenDialogShown(() => {
    //     DefaultAutomation.clickListItem('Alert')
    //   })
    //     .then((_dialog) => {
    //       dialog = _dialog
    //     })
    // })

    before(Co.wrap(function* () {
      dialog = yield DefaultAutomation.whenDialogShown(() => {
        DefaultAutomation.clickListItem('Alert')
      })
    }))

    it('should show an alert dialog with the text Danger!', () => {
      Assert.equal(DefaultAutomation.getAlertText(), 'Danger!')
    })

    after(() => {
      return DefaultAutomation.whenDialogHidden(() => {
        window.application.hideDialog(dialog)
      })
    })

  })

  describe('(when the item for Alert and the Ok button are clicked)', () => {

    // before(() => {
    //   return Promise.resolve()
    //     .then(() => DefaultAutomation.whenDialogShown(() => {
    //       DefaultAutomation.clickListItem('Alert')
    //     }))
    //     .then(() => DefaultAutomation.whenDialogHidden(() => {
    //       DefaultAutomation.clickAlertButton('Ok')
    //     }))
    // })

    before(Co.wrap(function* () {

      yield DefaultAutomation.whenDialogShown(() => {
        DefaultAutomation.clickListItem('Alert')
      })

      yield DefaultAutomation.whenDialogHidden(() => {
        DefaultAutomation.clickAlertButton('Ok')
      })

    }))

    it('should hide the alert dialog with the text Danger!', () => {
      Assert.equal(DefaultAutomation.existsAlertText('Danger!'), false)
    })

  })

  describe('(when the item for Confirmation is clicked)', () => {

    let dialog = null

    // before(() => {
    //   return DefaultAutomation.whenDialogShown(() => {
    //     DefaultAutomation.clickListItem('Confirmation')
    //   })
    //     .then((_dialog) => {
    //       dialog = _dialog
    //     })
    // })

    before(Co.wrap(function* () {
      dialog = yield DefaultAutomation.whenDialogShown(() => {
        DefaultAutomation.clickListItem('Confirmation')
      })
    }))

    it('should show a confirmation dialog with the text Are you sure?', () => {
      Assert.equal(DefaultAutomation.getConfirmationText(), 'Are you sure?')
    })

    // after(() => {
    //   return Promise.resolve()
    //     .then(() => DefaultAutomation.whenDialogShown(() => {
    //       window.application.hideDialog(dialog)
    //     }))
    //     .then((_dialog) => {
    //       dialog = _dialog
    //     })
    //     .then(() => DefaultAutomation.whenDialogHidden(() => {
    //       window.application.hideDialog(dialog)
    //     }))
    // })

    after(Co.wrap(function* () {

      dialog = yield DefaultAutomation.whenDialogShown(() => {
        window.application.hideDialog(dialog)
      })

      yield DefaultAutomation.whenDialogHidden(() => {
        window.application.hideDialog(dialog)
      })

    }))

  })

  describe('(when the item for Confirmation and the Yes button are clicked)', () => {

    let dialog = null

    // before(() => {
    //   return Promise.resolve()
    //     .then(() => DefaultAutomation.whenDialogShown(() => {
    //       DefaultAutomation.clickListItem('Confirmation')
    //     }))
    //     .then(() => DefaultAutomation.whenDialogShown(() => {
    //       DefaultAutomation.clickConfirmationButton('Yes')
    //     }))
    //     .then((_dialog) => {
    //       dialog = _dialog
    //     })
    // })

    before(Co.wrap(function* () {

      yield DefaultAutomation.whenDialogShown(() => {
        DefaultAutomation.clickListItem('Confirmation')
      })

      dialog = yield DefaultAutomation.whenDialogShown(() => {
        DefaultAutomation.clickConfirmationButton('Yes')
      })

    }))

    it('should show an alert dialog with the text You said ... Yes.', () => {
      Assert.equal(DefaultAutomation.getAlertText(), 'You said ... Yes.')
    })

    after(() => {
      return DefaultAutomation.whenDialogHidden(() => {
        window.application.hideDialog(dialog)
      })
    })

  })

  describe('(when the item for Confirmation and the No button are clicked)', () => {

    let dialog = null

    // before(() => {
    //   return Promise.resolve()
    //     .then(() => DefaultAutomation.whenDialogShown(() => {
    //       DefaultAutomation.clickListItem('Confirmation')
    //     }))
    //     .then(() => DefaultAutomation.whenDialogShown(() => {
    //       DefaultAutomation.clickConfirmationButton('No')
    //     }))
    //     .then((_dialog) => {
    //       dialog = _dialog
    //     })
    // })

    before(Co.wrap(function* () {

      yield DefaultAutomation.whenDialogShown(() => {
        DefaultAutomation.clickListItem('Confirmation')
      })

      dialog = yield DefaultAutomation.whenDialogShown(() => {
        DefaultAutomation.clickConfirmationButton('No')
      })

    }))

    it('should show an alert dialog with the text You said ... No.', () => {
      Assert.equal(DefaultAutomation.getAlertText(), 'You said ... No.')
    })

    after(() => {
      return DefaultAutomation.whenDialogHidden(() => {
        window.application.hideDialog(dialog)
      })
    })

  })

  describe('(when the item for Spinner is clicked)', () => {

    let dialog = null

    before(Co.wrap(function* () {
      dialog = yield DefaultAutomation.whenDialogShown(() => {
        DefaultAutomation.clickListItem('Spinner')
      })
    }))

    it('should show the spinner dialog', () => {
      Assert.equal(DefaultAutomation.existsSpinner(), true)
    })

    after(() => {
      return DefaultAutomation.whenDialogHidden(() => {
        // Do nothing ...
      })
    })

  })

  after(() => {
    return DefaultAutomation.whenPageShown(() => {
      window.application.popPage()
    })
  })

})
