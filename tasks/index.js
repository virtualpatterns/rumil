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

const INDEX_PATH = Path.join(__dirname, '..', 'index.json')
const LOG_PATH = Path.join(Process.LOG_PATH, `${Package.name}.jake.log`)
const RESOURCES_PATH = Path.join(__dirname, 'resources')

Log.addFile(LOG_PATH)

const ShellSilent = _Shell.context({
  'echoCommand': false
})

const ShellEcho = _Shell.context({
  'echoCommand': true
})

task('default', {'async': true}, () => {
  return ShellSilent('jake --tasks')
})

desc(`Hard-link ${Path.trim(Process.LOG_PATH)} to ${Process.env['HOME']}/Library/Logs/${Package.name}`)
task('link', {'async': true}, () => {
  return ShellSilent(`hln "${Process.LOG_PATH}" "${Process.env['HOME']}/Library/Logs/${Package.name}"`)
})

desc(`Hard-unlink ${Path.trim(Process.LOG_PATH)} to ${Process.env['HOME']}/Library/Logs/${Package.name}`)
task('unlink', {'async': true}, () => {
  return ShellSilent(`hln -u "${Process.env['HOME']}/Library/Logs/${Package.name}"`)
})

namespace('bundle', () => {

  desc('Create the application bundle(s)')
  task('create', {'async': true}, () => {

    // let CACHE_TIMESTAMP = null
    // let INDEX = null

    return Promise.resolve()
      .then(() => Log.debug('Started bundle:create ...'))
      .then(() => {
        return Promise.resolve()
          .then(() => FileSystem.Promise.access(INDEX_PATH, FileSystem.F_OK))
          .then(() => FileSystem.Promise.readFile(INDEX_PATH, {
            'encoding': 'utf-8'
          }))
          .then((data) => {

            let index = JSON.parse(data)
            index.value++

            return Promise.resolve(index)

          })
          .catch((error) => Promise.resolve({
            'value': 0
          }))
      })
      .then((index) => FileSystem.Promise.writeFile(INDEX_PATH, JSON.stringify(index), {
        'encoding': 'utf-8'
      }))
      .then(() => {

        // CACHE_TIMESTAMP = new Date().toISOString()

        // INDEX = index
        // INDEX.value++

        let Bundle = Bundler({
          'devtool': 'source-map',
          'entry': './www/scripts/index.js',
          // 'externals': [
          //   /datejs\/src/
          // ],
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
            // new Bundler.DefinePlugin({
            //   'CACHE_TIMESTAMP': JSON.stringify(CACHE_TIMESTAMP)
            //   // ,
            //   // 'INDEX': JSON.stringify(INDEX)
            // }),
            new Bundler.ExtendedAPIPlugin()
          ]
        })

        Bundle.Promise = {}
        Bundle.Promise.run = Promisify(Bundle.run, Bundle)

        return Bundle.Promise.run()

      })
      .then((statistics) => Log.debug('\n\n%s\n', statistics.toString()))
      // .then(() => FileSystem.Promise.writeFile('./cacheTimestamp.json', `{ "value": "${CACHE_TIMESTAMP}" }\n`, {
      //   'encoding': 'utf-8'
      // }))
      .then(() => {

        let Bundle = Bundler({
          'devtool': 'source-map',
          'entry': './www/scripts/sandbox.js',
          'output': {
            'filename': 'sandbox.js',
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
            new Bundler.ExtendedAPIPlugin()
          ]
        })

        Bundle.Promise = {}
        Bundle.Promise.run = Promisify(Bundle.run, Bundle)

        return Bundle.Promise.run()

      })
      .then((statistics) => Log.debug('\n\n%s\n', statistics.toString()))
      .then(() => Log.debug('... bundle:create finished'))

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
      .then(() => Log.debug('Started manifest:create ...'))
      .then(() => ShellEcho('appcache-manifest  --network-star \
                                                --output ./www/index.manifest \
                                                --prefix /www \
                                                  "./www/coverage/**/*.*" \
                                                  "./www/scripts/bundles/index.js" \
                                                  "./www/styles/index.css" \
                                                  "./www/resources/**/*.ico" \
                                                  "./www/vendor/mocha/mocha.css" \
                                                  "./www/vendor/mocha/mocha.js" \
                                                  "./www/vendor/**/*.{css,min.js,eot,otf,svg,ttf,woff,woff2}"'))
      .then(() => ShellSilent(`echo "# Created at ${new Date().toISOString()}" >> ./www/index.manifest`))
      .then(() => ShellEcho('appcache-manifest  --network-star \
                                                --output ./www/sandbox.manifest \
                                                --prefix /www \
                                                  "./www/scripts/bundles/sandbox.js" \
                                                  "./www/styles/sandbox.css" \
                                                  "./www/vendor/**/*.{css,min.js,eot,otf,svg,ttf,woff,woff2}"'))
      .then(() => ShellSilent(`echo "# Created at ${new Date().toISOString()}" >> ./www/sandbox.manifest`))
      .then(() => Log.debug('... manifest:create finished'))
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
    return ShellSilent('node ./server/index.js start')
  })

  desc('Start the server using defaults and fork')
  task('start', {'async': true}, () => {
    return ShellSilent('node ./server/index.js start --fork')
  })

  desc('Recycle (SIGHUP) the server')
  task('recycle', {'async': true}, () => {
    return Promise.resolve()
      .then(() => ShellSilent(`mv process/logs/rumil.log process/logs/rumil.${(new Date()).toString('yyyyMMddhhmmss')}.log`))
      .then(() => ShellSilent('kill -s HUP $(cat process/pids/rumil.pid)'))
  })

  desc('Stop the server using defaults')
  task('stop', {'async': true}, () => {
    return ShellSilent('node ./server/index.js stop')
  })

  desc('Restart the server using defaults')
  task('restart', {'async': true}, () => {
    return Promise.resolve()
      .then(() => Log.debug('Started server:restart ...'))
      .then(() => ShellSilent('jake server:stop'))
      .then(() => ShellSilent('jake server:start'))
      .then(() => Log.debug('... server:restart finished'))
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
    return ShellSilent('istanbul cover ./node_modules/.bin/_mocha --dir ./www/coverage -- --bail --timeout 0 server/tests')
  })

  // desc('Test /www')
  // task('www', {'async': true}, () => {
  //   // return ShellSilent(`mocha-phantomjs --bail --hooks "${Path.trim(Path.join(RESOURCES_PATH, 'hooks.js'))}" --ignore-resource-errors http://localhost:8080/www/index.html?page=./test-page.js`)
  //   return ShellSilent('lsp')
  // })

})

namespace('watch', () => {

  // desc('Run watch tasks in a split window')
  // task('run', ['bundle:create', 'manifest:create', 'server:restart'], {'async': true}, () => {
  //   return Promise.resolve()
  //     .then(() => ShellSilent('tmux new-session -d -s rumil-watch "jake bundle:watch"'))
  //     .then(() => ShellSilent('tmux select-window -t 0'))
  //     .then(() => ShellSilent('tmux rename-window -t 0 rumil-watch'))
  //     .then(() => ShellSilent('tmux split-window -p 66 -t 0 "jake manifest:watch"'))
  //     .then(() => ShellSilent('tmux split-window -t 1 "jake server:watch"'))
  //     .then(() => ShellSilent('tmux attach-session -t rumil-watch'))
  // })

  desc('Start watch tasks')
  task('start', ['bundle:create', 'manifest:create', 'server:restart'], {'async': true}, () => {
    return Promise.resolve()
      .then(() => ShellSilent('jake bundle:watch &'))
      .then(() => ShellSilent('jake manifest:watch &'))
      .then(() => ShellSilent('jake server:watch &'))
  })

  desc('Stop watch tasks')
  task('stop', {'async': true}, () => {
    return Promise.resolve()
      .then(() => ShellSilent('tmux kill-session -t rumil-watch', {
        'ignoreError': true
      }))
      .then(() => ShellSilent('pkill -f "jake bundle:watch"', {
        'ignoreError': true
      }))
      .then(() => ShellSilent('pkill -f "jake manifest:watch"', {
        'ignoreError': true
      }))
      .then(() => ShellSilent('pkill -f "jake server:watch"', {
        'ignoreError': true
      }))
  })

  desc('Restart the watch tasks')
  task('restart', {'async': true}, () => {
    return Promise.resolve()
      .then(() => Log.debug('Started watch:restart ...'))
      .then(() => ShellSilent('jake watch:stop'))
      .then(() => ShellSilent('jake watch:start'))
      .then(() => Log.debug('... watch:restart finished'))
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
