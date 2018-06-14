import query from '../../../../lib/query'
import { extractTag } from '../../..'

const COMMAND = 'namecheap.users.address.getList'

/**
 * Gets a list of address IDs and address names associated with the user account.
 * @param {Auth} Auth Authentication object.
 * @returns {Address[]} An array with addresses.
 */
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
 * Find a default address ID.
 * @param {Address[]} addresses A list of addresses.
 * @returns {number} A default address ID.
 */
export const findDefault = (addresses) => {
  const { AddressId } = addresses.find(({ IsDefault }) => IsDefault) || {}
  return AddressId
}

/**
 * @typedef Address
 * @property {number} AddressID A unique integer value that represents the address profile.
 * @property {number} AddressName The name of the address profile.
 * @property {boolean} IsDefault Whether it is a default address.
 *
 * @typedef {Object} Auth
 * @property {string} ApiUser Username required to access the API.
 * @property {string} ApiKey Password required used to access the API.
 * @property {string} ClientIp IP address of the client accessing your application (End-user IP address).
 */
