'use strict'

const Bundler = require('webpack')
const Cache = require('appcache-manifest')
const Co = require('co')
const Promisify = require("es6-promisify")
// const _Shell = require('pshell')

const FileSystem = require('../server/library/file-system')
const Log = require('../server/library/log')
const Path = require('../server/library/path')
const { ShellEcho, ShellQuiet, ShellSilent } = require('./library/shell')

const RESOURCES_PATH = Path.join(__dirname, 'resources')

// const ShellSilent = _Shell.context({
//   'echoCommand': false
// })
//
// const ShellEcho = _Shell.context({
//   'echoCommand': true
// })

namespace('bundle', () => {

  desc('Create the application bundle and manifest')
  task('create', {'async': true}, Co.wrap(function* () {

    Log.debug('> bundle:create')

    yield ShellQuiet('npm --force --no-git-tag-version version prerelease 1> /dev/null 2> /dev/null')

    let Bundle = Bundler({
      'devtool': 'source-map',
      'entry': {
        'index': [
          'babel-polyfill',
          `${Path.join(__dirname, '..', 'www', 'scripts', 'index.js')}`
        ]
      },
      'output': {
        'filename': '[name].js',
        'path': `${Path.join(__dirname, '..', 'www', 'scripts', 'bundles')}`
      },
      'module': {
        'loaders': [
          {
            'test': /\.js$/,
            'loader': 'babel-loader',
            'exclude': /node_modules/
          },
          {
            'test': /\.json$/,
            'loader': 'json-loader'
          },
          {
            'test': /\.pug$/,
            'loader': 'pug-loader',
            'query': {
              'pretty': true
            }
          }
        ]
      },
      'plugins': [
        new Bundler.ExtendedAPIPlugin()
      ]
    })

    Bundle.Promise = {}
    Bundle.Promise.run = Promisify(Bundle.run, Bundle)

    let status = yield Bundle.Promise.run()

    Log.debug('\n\n%s\n', status.toString({
      'colors': true,
      'hash': false,
      'version': true,
      'timings': true,
      'chunks': false,
      'chunkModules': false,
    }))

    Cache.generate([
      `${Path.join(__dirname, '..', 'www', 'configuration.json')}`,
      `${Path.join(__dirname, '..', 'www', 'coverage', '**', '*.*')}`,
      `${Path.join(__dirname, '..', 'www', 'scripts', 'bundles', '**', '*')}`,
      `${Path.join(__dirname, '..', 'www', 'styles', 'index.css')}`,
      `${Path.join(__dirname, '..', 'www', 'vendor', 'OnsenUI-dist-2.0.2', '**', '*.{css,js,eot,otf,svg,ttf,woff,woff2}')}`,
      `${Path.join(__dirname, '..', 'www', 'vendor', 'mocha', '**', '*.{css,js}')}`
    ], {
      'networkStar': true,
      'prefix': '/www',
      'stamp': true
    })
      .pipe(FileSystem.createWriteStream(`${Path.join(__dirname, '..', 'www', 'index.manifest')}`, {
        'defaultEncoding': 'utf8'
      }))

    Log.debug('< bundle:create')

  }))

  desc('Watch for changes requiring recreation of the application bundle and manifest')
  task('watch', {'async': true}, () => {
    return ShellQuiet(`nodemon --config "${Path.join(RESOURCES_PATH, 'bundle-watch.json')}" --on-change-only`)
  })

})
