import { c } from 'erte'
import { askSingle } from 'reloquent'

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
  console.log('Registering for:')
  printAddress(address)
  const y = await askSingle({
    text: 'OK?',
    defaultValue: 'y',
  })
  if (y != 'y') return
  const { ChargedAmount } = await nc.domains.create({
    domain,
    address,
  })
  console.log('Successfully registered %s! Charged amount: $%s.', c(domain, 'green'), ChargedAmount)
}

const printAddress = ({ FirstName, LastName, Address1, Address2, City, Zip, Country, EmailAddress }) => {
  console.log(' %s %s, %s', FirstName, LastName, EmailAddress)
  console.log(' %s', Address1)
  Address2 && console.log(' %s', Address2)
  console.log(' %s', City)
  console.log(' %s, %s', Zip, Country)
}
