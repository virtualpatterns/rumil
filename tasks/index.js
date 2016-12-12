'use strict'

require('datejs')

const Bundler = require('webpack')
const Co = require('co')
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

const INDEX_CONFIGURATION = {
  'devtool': 'source-map',
  // 'entry': './www/scripts/index.js',
  // 'entry': [
  //   'babel-polyfill',
  //   './www/scripts/index.js'
  // ],
  'entry': {
    'index': [
      'babel-polyfill',
      './www/scripts/index.js'
    ],
    'sandbox': [
      'babel-polyfill',
      './www/scripts/sandbox.js'
    ],
  },
  'output': {
    'filename': '[name].js',
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
}

// const SANDBOX_CONFIGURATION = {
//   'devtool': 'source-map',
//   'entry': [
//     'babel-polyfill',
//     './www/scripts/sandbox.js'
//   ],
//   'output': {
//     'filename': 'sandbox.js',
//     'path': './www/scripts/bundles'
//   },
//   'module': {
//     'loaders': [
//       {
//         'test': /\.js$/,
//         'loader': 'babel-loader',
//         'exclude': /node_modules/
//       },
//       {
//         'test': /\.json$/,
//         'loader': 'json-loader'
//       },
//       {
//         'test': /\.pug$/,
//         'loader': 'pug-loader',
//         'query': {
//           'pretty': true
//         }
//       }
//     ]
//   },
//   'plugins': [
//     new Bundler.ExtendedAPIPlugin()
//   ]
// }

Log
  .addConsole()
  // .addFile(LOG_PATH)

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

  // desc('Create the indexapplication bundle')
  // task('createIndex', {'async': true}, () => {
  desc('Create the application bundle')
  task('create', {'async': true}, Co.wrap(function* () {
    // return Co(function* () {

      Log.debug('> bundle:createIndex')

      let index = null

      try {
        yield FileSystem.Promise.access(INDEX_PATH, FileSystem.F_OK)
        index = JSON.parse(yield FileSystem.Promise.readFile(INDEX_PATH, {
          'encoding': 'utf-8'
        }))
      }
      catch (error) {
        Log.error(error)
        index = {
          'value': -1
        }
      }

      index.value++

      yield FileSystem.Promise.writeFile(INDEX_PATH, JSON.stringify(index), {
        'encoding': 'utf-8'
      })

      let Bundle = Bundler(INDEX_CONFIGURATION)

      Bundle.Promise = {}
      Bundle.Promise.run = Promisify(Bundle.run, Bundle)

      let status = yield Bundle.Promise.run()

      Log.debug('\n\n%s\n', status.toString({
        'colors': true,
        'hash': false, // add the hash of the compilation
        'version': true, // add webpack version information
        'timings': true, // add timing information
        'assets': true, // add assets information
        'chunks': true, // add chunk information (setting this to false allows for a less verbose output)
        'chunkModules': false, // add built modules information to chunk information
        'modules': false, // add built modules information
        'children': false, // add children information
        'cached': false, // add also information about cached (not built) modules
        'reasons': false, // add information about the reasons why modules are included
        'source': false, // add the source code of modules
        'errorDetails': false, // add details to errors (like resolving log)
        'chunkOrigins': false // add the origins of chunks and chunk merging info
      }))

      Log.debug('< bundle:createIndex')

    // })
  }))

  // desc('Create the sandbox application bundle')
  // task('createSandbox', {'async': true}, () => {
  //   return Co(function* () {
  //
  //     Log.debug('> bundle:createSandbox')
  //
  //     let Bundle = Bundler(SANDBOX_CONFIGURATION)
  //
  //     Bundle.Promise = {}
  //     Bundle.Promise.run = Promisify(Bundle.run, Bundle)
  //
  //     let status = yield Bundle.Promise.run()
  //
  //     Log.debug('\n\n%s\n', status.toString({
  //       'colors': true,
  //       'hash': false, // add the hash of the compilation
  //       'version': true, // add webpack version information
  //       'timings': true, // add timing information
  //       'assets': true, // add assets information
  //       'chunks': true, // add chunk information (setting this to false allows for a less verbose output)
  //       'chunkModules': false, // add built modules information to chunk information
  //       'modules': false, // add built modules information
  //       'children': false, // add children information
  //       'cached': false, // add also information about cached (not built) modules
  //       'reasons': false, // add information about the reasons why modules are included
  //       'source': false, // add the source code of modules
  //       'errorDetails': false, // add details to errors (like resolving log)
  //       'chunkOrigins': false // add the origins of chunks and chunk merging info
  //     }))
  //
  //     Log.debug('< bundle:createSandbox')
  //
  //   })
  // })

  // desc('Create the application bundle(s)')
  // // task('create', ['bundle:createIndex', 'bundle:createSandbox'], () => {
  // task('create', ['bundle:createIndex'], () => {
  // })

  // watchTask('watch', ['bundle:create'], function () {
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
    return Co(function* () {

      Log.debug('> manifest:create')

      yield ShellSilent('appcache-manifest  --network-star \
                                            --output ./www/index.manifest \
                                            --prefix /www \
                                              "./www/coverage/**/*.*" \
                                              "./www/scripts/bundles/index.js" \
                                              "./www/styles/index.css" \
                                              "./www/resources/**/*.ico" \
                                              "./www/vendor/mocha/mocha.css" \
                                              "./www/vendor/mocha/mocha.js" \
                                              "./www/vendor/**/*.{css,min.js,eot,otf,svg,ttf,woff,woff2}"')

      yield ShellSilent(`echo "# Created at ${new Date().toISOString()}" >> ./www/index.manifest`)

      yield ShellSilent('appcache-manifest  --network-star \
                                            --output ./www/sandbox.manifest \
                                            --prefix /www \
                                              "./www/scripts/bundles/sandbox.js" \
                                              "./www/styles/sandbox.css" \
                                              "./www/styles/reset.css" \
                                              "./www/vendor/**/*.{css,min.js,eot,otf,svg,ttf,woff,woff2}"')

      yield ShellSilent(`echo "# Created at ${new Date().toISOString()}" >> ./www/sandbox.manifest`)

      Log.debug('< manifest:create')

    })
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

  desc('Debug the server on port 8181')
  task('debug', {'async': true}, () => {
    return ShellSilent('node-debug ./server/index.js start --port 8181')
  })

  desc('Run the server using defaults')
  task('run', {'async': true}, () => {
    return ShellSilent('node ./server/index.js start')
  })

  desc('Start the server using defaults and fork')
  task('start', {'async': true}, () => {
    return ShellSilent('node ./server/index.js start --fork')
  })

  desc('Trim the server log (via SIGHUP)')
  task('trim', {'async': true}, () => {
    return Co(function* () {

      Log.debug('> server:trim')

      yield ShellSilent(`mv process/logs/rumil.log process/logs/rumil.${(new Date()).toString('yyyyMMddhhmmss')}.log`, {
        'ignoreError': true
      })
      yield ShellSilent('find process/logs -name rumil.*.log -type f -mmin +15 -delete', {
        'ignoreError': true
      })
      yield ShellSilent('kill -s HUP $(cat process/pids/rumil.pid)', {
        'ignoreError': true
      })

      Log.debug('< server:trim')

    })
  })

  desc('Stop the server using defaults')
  task('stop', {'async': true}, () => {
    return ShellSilent('node ./server/index.js stop')
  })

  desc('Restart the server using defaults')
  task('restart', {'async': true}, () => {
    return Co(function* () {

      Log.debug('> server:restart')

      yield ShellSilent('jake server:trim')
      yield ShellSilent('jake server:stop')
      yield ShellSilent('jake server:start')

      Log.debug('< server:restart')

    })
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

namespace('storage', () => {

  desc('Start the storage server')
  task('start', {'async': true}, () => {
    return ShellSilent('redis-server ./redis.config')
  })

  desc('Trim the storage server log (via SIGHUP)')
  task('trim', {'async': true}, () => {
    return Co(function* () {

      Log.debug('> storage server:trim')

      yield ShellSilent(`mv process/logs/redis.log process/logs/redis.${(new Date()).toString('yyyyMMddhhmmss')}.log`, {
        'ignoreError': true
      })
      yield ShellSilent('find process/logs -name redis.*.log -type f -mmin +15 -delete', {
        'ignoreError': true
      })
      yield ShellSilent('kill -s HUP $(cat process/pids/redis.pid)', {
        'ignoreError': true
      })

      Log.debug('< storage server:trim')

    })
  })

  desc('Stop the storage server')
  task('stop', {'async': true}, () => {
    return ShellSilent('kill $(cat process/pids/redis.pid)')
  })

  desc('Restart the storage server using defaults')
  task('restart', {'async': true}, () => {
    return Co(function* () {

      Log.debug('> storage:restart')

      yield ShellSilent('jake storage:trim')
      yield ShellSilent('jake storage:stop')
      yield ShellSilent('jake storage:start')

      Log.debug('< storage:restart')

    })
  })

  // watchTask('watch', ['storage:restart'], function () {
  //   this.watchFiles
  //     // Default includes/excludes
  //     // .include('./**/*.js')
  //     // .include('./**/*.coffee')
  //     // .include('./**/*.css')
  //     // .include('./**/*.less')
  //     // .include('./**/*.scss')
  //     // .exclude('node_modules/**')
  //     // .exclude('.git/**')
  //     .exclude('./process/**/*.*')
  //     .exclude('./sandbox/**/*.*')
  //     .exclude('./storage server/tests/**/*.*')
  //     .exclude('./tasks/**/*.*')
  //     .exclude('./www/**/*.*')
  //     .include('./*.json')
  // })

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
    return Co(function* () {

      Log.debug('> watch:start')

      yield ShellSilent('jake bundle:watch &')
      yield ShellSilent('jake manifest:watch &')
      yield ShellSilent('jake server:watch &')

      Log.debug('< watch:start')

    })
  })

  desc('Stop watch tasks')
  task('stop', {'async': true}, () => {
    return Co(function* () {

      Log.debug('> watch:stop')

      // yield ShellSilent('tmux kill-session -t rumil-watch', {
      //   'ignoreError': true
      // })

      yield ShellSilent('pkill -f "jake bundle:watch"', {
        'ignoreError': true
      })
      yield ShellSilent('pkill -f "jake manifest:watch"', {
        'ignoreError': true
      })
      yield ShellSilent('pkill -f "jake server:watch"', {
        'ignoreError': true
      })

      Log.debug('< watch:stop')

    })
  })

  desc('Restart the watch tasks')
  task('restart', {'async': true}, () => {
    return Co(function* () {

      Log.debug('> watch:restart')

      yield ShellSilent('jake watch:stop')
      yield ShellSilent('jake watch:start')

      Log.debug('< watch:restart')

    })
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
      .exclude('./www/**/*.*')
  })

})
