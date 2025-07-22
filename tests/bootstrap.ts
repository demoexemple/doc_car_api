import { assert } from '@japa/assert'
import { apiClient } from '@japa/api-client'
import app from '@adonisjs/core/services/app'
import type { Config } from '@japa/runner/types'
import { pluginAdonisJS } from '@japa/plugin-adonisjs'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * This file is imported by the "bin/test.ts" entrypoint file
 */

/**
 * Configure Japa plugins in the plugins array.
 * Learn more - https://japa.dev/docs/runner-config#plugins-optional
 */
export const plugins: Config['plugins'] = [assert(), apiClient(), pluginAdonisJS(app)]

/**
 * Configure lifecycle function to run before and after all the
 * tests.
 *
 * The setup functions are executed before all the tests
 * The teardown functions are executed after all the tests
 */
export const runnerHooks: Required<Pick<Config, 'setup' | 'teardown'>> = {
  setup: [],
  teardown: [],
}

/**
 * Configure suites by tapping into the test suite instance.
 * Learn more - https://japa.dev/docs/test-suites#lifecycle-hooks
 */
export const configureSuite: Config['configureSuite'] = (suite) => {
  if (['browser', 'functional', 'e2e'].includes(suite.name)) {
    return suite.setup(() => testUtils.httpServer().start())
  }
}

/**
 * URL to the AdonisJS app root. AdonisJS will first
 * look for this file to boot the application
 */
// const APP_ROOT = new URL('../', import.meta.url)

/**
 * Run the tests
 */
// async function runTests() {
//   const ignitor = new Ignitor(APP_ROOT, {
//     importer: (filePath) => {
//       if (filePath.startsWith('./') || filePath.startsWith('../')) {
//         return import(new URL(filePath, APP_ROOT).href)
//       }
//       return import(filePath)
//     },
//   })


//   /**
//    * Configure tests
//    */
//   configure({
//     files: ['tests/**/*.spec.ts'],
//     plugins: [
//     ],
//     forceExit: false,
//   })

//   /**
//    * Process CLI arguments
//    */
//   processCLIArgs(process.argv.slice(2))

//   /**
//    * Run tests
//    */
//   await run()
// }

// runTests().catch((error) => {
//   console.error('Error occurred during tests')
//   prettyPrintError(error)
//   process.exit(1)
// })
