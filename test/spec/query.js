import { deepEqual, equal, ok } from 'zoroaster/assert'
import { getError } from '../../src/lib/query'
import Context from '../context'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  'extracts an error'({ InvalidRequestIp }) {
    const error = getError(InvalidRequestIp)
    ok(error instanceof Error)
    equal(error.message, 'Invalid request IP: 82.132.224.85')
    deepEqual(error.props, {
      Number: 1011150,
    })
  },
  'does not extract an error'({ Addresses }) {
    const error = getError(Addresses)
    equal(error, undefined)
  },
}

export default T
