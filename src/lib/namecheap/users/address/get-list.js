import query from '../../../../lib/query'
import { extractTag } from '../../..'

const GET_LIST = 'namecheap.users.address.getList'

/**
 * @param {string} domain a domain name to view info for.
 */
const getList = async (Auth = {}) => {
  const res = await query({
    ...Auth,
  }, GET_LIST)
  const [{ content: AddressGetListResult }] = extractTag('AddressGetListResult', res)
  const List = extractTag('List', AddressGetListResult)
  const addresses = List.map(({ props }) => props)
  const { AddressId } = addresses.find(({ IsDefault }) => IsDefault) || {}
  return {
    addresses,
    defaultId: AddressId,
  }
}

export default getList
