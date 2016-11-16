'use strict'

const Assert = require('assert')

const Package = require('../../package.json')
const Path = require('../library/path')
const Process = require('../library/process')

const FILE_PATH = Path.join(Process.OUTPUT_PATH, `${Package.name}.mocha.out`)

describe('Path', () => {

  describe('trim', () => {

    it('should replace the working directory with .', () => {
      Assert.equal(Path.trim(FILE_PATH), './process/output/rumil.mocha.out')
    })

  })

})
