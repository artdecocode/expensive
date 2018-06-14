import { ok } from 'assert'
import getList from '../../../../../src/lib/namecheap/users/address/get-list'
import Context from '../../../../context'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  async 'gets a list of addresses'({ Auth }) {
    const res = await getList(Auth)
    ok(Array.isArray(res))
  },
}

export default T
