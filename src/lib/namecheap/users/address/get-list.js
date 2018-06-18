import query from '../../../../lib/query'
import { extractTag } from '../../..'

const COMMAND = 'namecheap.users.address.getList'

export default async function getList(Auth = {}) {
  const res = await query({
    ...Auth,
  }, COMMAND)
  const [{ content: AddressGetListResult }] = extractTag('AddressGetListResult', res)
  const List = extractTag('List', AddressGetListResult)
  const addresses = List.map(({ props }) => props)
  return addresses
}

/**
 * @typedef Address
 * @property {number} AddressID A unique integer value that represents the address profile.
 * @property {number} AddressName The name of the address profile.
 * @property {boolean} IsDefault Whether it is a default address.
 */
