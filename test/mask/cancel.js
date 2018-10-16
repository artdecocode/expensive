import { makeTestSuite } from 'zoroaster'
import { fork } from 'spawncommand'
import Context from '../context'
import forkFeed from 'forkfeed'

const BIN = Context.BIN

const ENV = { NODE_DEBUG: 'expensive', SANDBOX: '1' }

const context = { bin: BIN, env: ENV }

const OK_NO = makeTestSuite('test/result/cancel.md', {
  context,
  fork: {
    module: BIN,
    /**
     * @param {context}
     */
    getOptions({ env }) {
      return { env }
    },
    inputs: [
      [/Apply coupon/, 'y'],
      [/OK/, 'n'],
    ],
    // log: true,
  },
  mapActual({ stderr }) {
    return stderr
      .replace(/EXPENSIVE \d+: /, '')
  },
})

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
    // p.stderr.pipe(process.stderr)
    forkFeed(p.stdout, p.stdin,
      [
        [/Apply coupon/, 'y'],
      ],
      // process.stdout,
    )
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

// const re = /\033\[.+?m/g

// export default ts
export { OK_NO }
export { stdinEnd }