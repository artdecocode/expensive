import { ok } from 'zoroaster/assert'
import Context from '../context'
import { validateDomains, isSingleWord } from '../../src/lib'

export const ValidateDomains = {
  'validates domains as false'() {
    const res = validateDomains([1, 'test'])
    ok(!res)
  },
  'validates domains as true'() {
    const res = validateDomains(['test1', 'test'])
    ok(res)
  },
}

export const IsSingleWord = {
  'returns true'() {
    const res = isSingleWord('test')
    ok(res)
  },
  'returns false'() {
    const res = isSingleWord('test.com')
    ok(!res)
  },
}
/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
}

export default T
