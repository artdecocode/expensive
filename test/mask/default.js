import { makeTestSuite } from 'zoroaster'
import Context from '../context'

const ts = makeTestSuite('test/result/fork/default.md', {
  fork: {
    module: Context.BIN,
    options: Context.OPTIONS,
  },
  mapActual({ stdout }) {
    return Context.strip(stdout)
  },
})


export default ts