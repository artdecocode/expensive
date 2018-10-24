import { makeTestSuite } from 'zoroaster'
import Context from '../context'

const ts = makeTestSuite('test/result/fork/default.md', {
  fork: new Context(),
})


export default ts