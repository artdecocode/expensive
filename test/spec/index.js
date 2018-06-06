import { equal } from 'zoroaster/assert'
import Context from '../context'
import expensive from '../../src'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  'is a function'() {
    equal(typeof expensive, 'function')
  },
  async 'calls package without error'() {
    await expensive()
  },
  async 'calls test context method'({ example }) {
    await example()
  },
}

export default T
