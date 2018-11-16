import { makeTestSuite } from 'zoroaster'
import { fork } from 'spawncommand'
import Context from '../context'
import forkFeed from 'forkfeed'

const BIN = Context.BIN

const ENV = { NODE_DEBUG: 'expensive', SANDBOX: '1' }

const context = { bin: BIN, env: ENV }

const stdinEnd = makeTestSuite('test/result/cancel.md', {
  context,
  /**
   * @param {string} input
   * @param {context} param
   */
  getReadable(input, { bin, env }) {
    const p = fork(bin, input.split(' '), {
      env,
      stdio: 'pipe',
      execArgv: [],
    })
    forkFeed(p.stdout, p.stdin, [
      [/Apply coupon/, 'n'],
    ])
    p.stdout.on('data', (d) => {
      if (/OK/.test(d)) {
        p.stdin.end()
      }
    })
    return p.stderr
  },
  mapActual(stderr) {
    return stderr
      .replace(/EXPENSIVE \d+: /, '')
  },
})

export default stdinEnd