import { c } from 'erte'

/**
 * @extends {ForkConfig}
 */
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
  static get BIN() {
    const b = 'build/bin/expensive'
    if (TEST_BUILD) console.log('Testing BUILD %s', c(b, 'green'))
    return TEST_BUILD == 'test-build' ? b : 'src/bin'
  }
  static mapActual({ stdout }) { return Context.strip(stdout) }

  static strip(s) {
    return s
      .replace(re, '')
      .split('\n').map(l => l.trimRight()).join('\n')
      .trim()
  }
  /** Remove the \r from each line keeping only the last message. */
  static replaceR(s) {
    const st = s.split('\n').map(l => {
      const r = l.split('\r')
      const last = r[r.length - 1]
      return last
    }).join('\n')
    return st
  }
}

const re = /\033\[.*?m/g


const TEST_BUILD = process.env.ALAMODE_ENV == 'test-build'

/**
 * @typedef {import('@zoroaster/fork').ForkConfig} ForkConfig
 */