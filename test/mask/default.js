import makeTestSuite from '@zoroaster/mask'
import Context from '../context'

const ts = makeTestSuite('test/result/fork/default.md', {
  fork: {
    module: Context.BIN,
    options: Context.OPTIONS,
    log: true,
    preprocess: Context.trimRight,
  },
})


export default ts