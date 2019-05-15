import makeTestSuite from '@zoroaster/mask'
import { fork } from 'spawncommand'
import Context from '../context'
import forkFeed from 'forkfeed'

const BIN = Context.BIN

const ENV = { NODE_DEBUG: 'expensive', SANDBOX: '1' }

const context = { bin: BIN, env: ENV }

const stdinEnd = makeTestSuite('test/result/cancel.md', {
  context,
  /**
   * @param {context} param
   */
  getReadable({ bin, env }) {
    const p = fork(bin, this.input.split(' '), {
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