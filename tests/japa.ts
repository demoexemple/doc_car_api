import { configure, processCLIArgs, run } from '@japa/runner'

/**
 * Configure tests
 */
configure({
  files: ['tests/**/*.spec.ts'],
  forceExit: false,
})

/**
 * Process CLI arguments
 */
processCLIArgs(process.argv.slice(2))

/**
 * Run tests
 */
await run() 