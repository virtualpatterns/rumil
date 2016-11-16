'use strict'

require('datejs')

const Bundler = require('webpack')
const Promisify = require("es6-promisify")
const _Shell = require('pshell')

const FileSystem = require('../server/library/file-system')
const Log = require('../server/library/log')
const Package = require('../package.json')
const Path = require('../server/library/path')
const Process = require('../server/library/process')

const LOG_PATH = Path.join(Process.LOG_PATH, `${Package.name}.jake.log`)
const RESOURCES_PATH = Path.join(__dirname, 'resources')

Log.addFile(LOG_PATH)

const Shell = _Shell.context({
  'echoCommand': false
})

// const ShellEcho = _Shell.context({
//   'echoCommand': true,
//   'captureOutput': true
// })

task('default', {'async': true}, () => {
  return Shell('jake --tasks')
})

desc(`Hard-link ${Path.trim(Process.LOG_PATH)} to ${Process.env['HOME']}/Library/Logs/${Package.name}`)
task('link', {'async': true}, () => {
  return Shell(`hln "${Process.LOG_PATH}" "${Process.env['HOME']}/Library/Logs/${Package.name}"`)
})

desc(`Hard-unlink ${Path.trim(Process.LOG_PATH)} to ${Process.env['HOME']}/Library/Logs/${Package.name}`)
task('unlink', {'async': true}, () => {
  return Shell(`hln -u "${Process.env['HOME']}/Library/Logs/${Package.name}"`)
})

namespace('bundle', () => {

  desc('Create the application bundle')
  task('create', {'async': true}, () => {

    let CACHE_TIMESTAMP = new Date().toISOString()

    let Bundle = Bundler({
      'devtool': 'source-map',
      'entry': './www/scripts/index.js',
      'output': {
        'filename': 'index.js',
        'path': './www/scripts/bundles'
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
            'loader': 'pug-loader?pretty=true'
          }
        ]
      },
      'plugins': [
        new Bundler.DefinePlugin({
          'CACHE_TIMESTAMP': JSON.stringify(CACHE_TIMESTAMP)
        }),
        new Bundler.ExtendedAPIPlugin()
      ]
    })

    Bundle.Promise = {}
    Bundle.Promise.run = Promisify(Bundle.run, Bundle)

    return Promise.resolve()
      .then(() => Log.info('Started bundle:create ...'))
      .then(() => Bundle.Promise.run())
      .then((statistics) => Log.info('\n\n%s\n', statistics.toString()))
      .then(() => FileSystem.Promise.writeFile('./cacheTimestamp.json', `{ "value": "${CACHE_TIMESTAMP}" }\n`, {
        'encoding': 'utf-8'
      }))
      .then(() => Log.info('... bundle:create finished'))

  })

  watchTask('watch', ['bundle:create'], function () {
    this.watchFiles
      // Default includes/excludes
      // .include('./**/*.js')
      // .include('./**/*.coffee')
      // .include('./**/*.css')
      // .include('./**/*.less')
      // .include('./**/*.scss')
      // .exclude('node_modules/**')
      // .exclude('.git/**')
      .exclude('./process/**/*.*')
      .exclude('./sandbox/**/*.*')
      .exclude('./server/**/*.*')
      .exclude('./tasks/**/*.*')
      .exclude('./www/coverage/**/*.*')
      .exclude('./www/scripts/bundles/**/*.*')
      .exclude('./www/**/*.{css,html}')
      .include('./www/**/*.pug')
      .include('./package.json')
  })

})

namespace('manifest', () => {

  desc('Create the application cache manifest')
  task('create', {'async': true}, () => {

    let CACHE_TIMESTAMP = new Date().toISOString()

    return Promise.resolve()
      .then(() => Log.info('Started manifest:create ...'))
      .then(() => Shell('appcache-manifest  --network-star \
                                            --output ./www/index.manifest \
                                            --prefix /www \
                                              "./www/coverage/**/*.*" \
                                              "./www/scripts/bundles/**/*.js" \
                                              "./www/styles/**/*.css" \
                                              "./www/resources/**/*.ico" \
                                              "./www/vendor/mocha/mocha.css" \
                                              "./www/vendor/mocha/mocha.js" \
                                              "./www/vendor/**/*.{css,min.js,eot,otf,svg,ttf,woff,woff2}"'))
      .then(() => Shell(`echo "# ${CACHE_TIMESTAMP}" >> ./www/index.manifest`))
      .then(() => Log.info('... manifest:create finished'))
  })

  watchTask('watch', ['manifest:create'], function () {
    this.watchFiles
      // Default includes/excludes
      // .include('./**/*.js')
      // .include('./**/*.coffee')
      // .include('./**/*.css')
      // .include('./**/*.less')
      // .include('./**/*.scss')
      // .exclude('node_modules/**')
      // .exclude('.git/**')
      .exclude('./process/**/*.*')
      .exclude('./sandbox/**/*.*')
      .exclude('./server/**/*.*')
      .exclude('./tasks/**/*.*')
      .include('./www/coverage/**/*.*')
      .include('./www/resources/**/*.*')
      .include('./www/vendor/**/*.{css,min.js,eot,otf,svg,ttf,woff,woff2}')
  })

})

namespace('server', () => {

  desc('Run the server using defaults')
  task('run', {'async': true}, () => {
    return Shell('node ./server/index.js start')
  })

  desc('Start the server using defaults and fork')
  task('start', {'async': true}, () => {
    return Shell('node ./server/index.js start --fork')
  })

  desc('Recycle (SIGHUP) the server')
  task('recycle', {'async': true}, () => {
    return Promise.resolve()
      .then(() => Shell(`mv process/logs/rumil.log process/logs/rumil.${(new Date()).toString('yyyyMMddhhmmss')}.log`))
      .then(() => Shell('kill -s HUP $(cat process/pids/rumil.pid)'))
  })

  desc('Stop the server using defaults')
  task('stop', {'async': true}, () => {
    return Shell('node ./server/index.js stop')
  })

  desc('Restart the server using defaults')
  task('restart', {'async': true}, () => {
    return Promise.resolve()
      .then(() => Log.info('Started server:restart ...'))
      .then(() => Shell('jake server:stop'))
      .then(() => Shell('jake server:start'))
      .then(() => Log.info('... server:restart finished'))
  })

  watchTask('watch', ['server:restart'], function () {
    this.watchFiles
      // Default includes/excludes
      // .include('./**/*.js')
      // .include('./**/*.coffee')
      // .include('./**/*.css')
      // .include('./**/*.less')
      // .include('./**/*.scss')
      // .exclude('node_modules/**')
      // .exclude('.git/**')
      .exclude('./process/**/*.*')
      .exclude('./sandbox/**/*.*')
      .exclude('./server/tests/**/*.*')
      .exclude('./tasks/**/*.*')
      .exclude('./www/**/*.*')
      .include('./*.json')
  })

})

namespace('test', () => {

  desc('Test and generate coverage for the server')
  task('server', {'async': true}, () => {
    return Shell('istanbul cover ./node_modules/.bin/_mocha --dir ./www/coverage -- --bail --timeout 0 server/tests')
  })

  // desc('Test /www')
  // task('www', {'async': true}, () => {
  //   // return Shell(`mocha-phantomjs --bail --hooks "${Path.trim(Path.join(RESOURCES_PATH, 'hooks.js'))}" --ignore-resource-errors http://localhost:8080/www/index.html?page=./test-page.js`)
  //   return Shell('lsp')
  // })

})

namespace('watch', () => {

  // desc('Run watch tasks in a split window')
  // task('run', ['bundle:create', 'manifest:create', 'server:restart'], {'async': true}, () => {
  //   return Promise.resolve()
  //     .then(() => Shell('tmux new-session -d -s rumil-watch "jake bundle:watch"'))
  //     .then(() => Shell('tmux select-window -t 0'))
  //     .then(() => Shell('tmux rename-window -t 0 rumil-watch'))
  //     .then(() => Shell('tmux split-window -p 66 -t 0 "jake manifest:watch"'))
  //     .then(() => Shell('tmux split-window -t 1 "jake server:watch"'))
  //     .then(() => Shell('tmux attach-session -t rumil-watch'))
  // })

  desc('Start watch tasks')
  task('start', ['bundle:create', 'manifest:create', 'server:restart'], {'async': true}, () => {
    return Promise.resolve()
      .then(() => Shell('jake bundle:watch &'))
      .then(() => Shell('jake manifest:watch &'))
      .then(() => Shell('jake server:watch &'))
  })

  desc('Stop watch tasks')
  task('stop', {'async': true}, () => {
    return Promise.resolve()
      .then(() => Shell('tmux kill-session -t rumil-watch', {
        'ignoreError': true
      }))
      .then(() => Shell('pkill -f "jake bundle:watch"', {
        'ignoreError': true
      }))
      .then(() => Shell('pkill -f "jake manifest:watch"', {
        'ignoreError': true
      }))
      .then(() => Shell('pkill -f "jake server:watch"', {
        'ignoreError': true
      }))
  })

  desc('Restart the watch tasks')
  task('restart', {'async': true}, () => {
    return Promise.resolve()
      .then(() => Log.info('Started watch:restart ...'))
      .then(() => Shell('jake watch:stop'))
      .then(() => Shell('jake watch:start'))
      .then(() => Log.info('... watch:restart finished'))
  })

  watchTask('watch', ['watch:restart'], function () {
    this.watchFiles
      // Default includes/excludes
      // .include('./**/*.js')
      // .include('./**/*.coffee')
      // .include('./**/*.css')
      // .include('./**/*.less')
      // .include('./**/*.scss')
      // .exclude('node_modules/**')
      // .exclude('.git/**')
      .exclude('./process/**/*.*')
      .exclude('./sandbox/**/*.*')
      .exclude('./server/**/*.*')
      // .exclude('./tasks/**/*.js')
      .exclude('./www/**/*.*')
  })

})
