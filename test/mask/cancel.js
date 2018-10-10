import { makeTestSuite } from 'zoroaster'
import { fork } from 'spawncommand'
import Context from '../context'

const BIN = Context.BIN

const ts = makeTestSuite('test/result/cancel.md', {
  context: { BIN },
  getReadable(input, { BIN: bin }) {
    const p = fork(bin, input.split(' '), {
      stdio: 'pipe',
      execArgv: [],
      env: { NODE_DEBUG: 'expensive' },
    })
    p.stdout.on('data', (d) => {
      if (/OK/.test(d)) {
        p.stdin.end()
      }
    })
    return p.stderr
  },
  mapActual(act) {
    return act
      .replace(/EXPENSIVE \d+: /, '')
  },
})

// const re = /\033\[.+?m/g

export default ts