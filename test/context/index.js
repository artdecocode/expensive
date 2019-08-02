import { c } from 'erte'
import clearr from 'clearr'

export default class Context {
  constructor() {
    const d = new Date().toLocaleString().replace(/[ :]/g, '-')
    this.domain = `expensive-test-${d}`
  }
  /**
   * Example method.
   */
  get module() {
    return Context.BIN
  }
  get options() {
    return Context.OPTIONS
  }
  static get OPTIONS() {
    return { env: { SANDBOX: '1' } }
  }
  static trimRight(s) {
    const r = clearr(s)
    return r
      .split('\n').map(l => l.trimRight()).join('\n')
      .trim()
  }
  static get BIN() {
    const b = 'compile/bin/expensive'
    if (TEST_BUILD) console.log('Testing COMPILE %s', c(b, 'green'))
    return TEST_BUILD ? b : 'src/bin'
  }
}

const TEST_BUILD = process.env.ALAMODE_ENV == 'test-compile'