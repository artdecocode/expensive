import { equal } from 'zoroaster/assert'
import Context from '../context'
import expensive2 from '../../src'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  'is a function'() {
    equal(typeof expensive2, 'function')
  },
  async 'calls package without error'() {
    await expensive2()
  },
  async 'calls test context method'({ example }) {
    await example()
  },
}

export default T
