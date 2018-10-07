import { c } from 'erte'
/**
 * A testing context for the package.
 */
export default class Context {
  constructor() {
    const d = new Date().toLocaleString().replace(/[ :]/g, '-')
    this.domain = `expensive-test-${d}`
  }
  /**
   * Example method.
   */
  example() {
    return 'OK'
  }
  static get BIN() {
    const b = 'build/bin/expensive'
    if (TEST_BUILD) console.log('Testing BUILD %s', c(b, 'green'))
    return TEST_BUILD == 'test-build' ? b : 'src/bin'
  }

  async _destroy() {
  }
}

const TEST_BUILD = process.env.ALAMODE_ENV == 'test-build'