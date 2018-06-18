import { askSingle } from 'reloquent'
import printList from '../lib/print/list'
import { getAddressList, getAddressInfo } from '..'
import Namecheap from '../Namecheap' // eslint-disable-line

/**
 * Find a default address ID.
 * @param {Address[]} addresses A list of addresses.
 * @returns {number} A default address ID.
 */
export const findDefault = (addresses) => {
  const { AddressId } = addresses.find(({ IsDefault }) => IsDefault) || {}
  return AddressId
}

/** @param {Namecheap} nc */
export default async function register(nc, {
  domain,
}) {
  const addresses = await nc.users.address.getList()
  const id = findDefault(addresses)
  const address = await nc.users.address.getInfo({ id })
  debugger
  // const address = await getAddressInfo(Auth, { id: defaultId })
}
