import query from '../../../../lib/query'
import { extractTag } from '../../..'

const GET_INFO = 'namecheap.users.address.getInfo'

/**
 * Get information about an address id.
 * @param {Auth} Auth Authentication object.
 * @param {Config} conf Configuration parameters.
 * @param {number} conf.id ID of an address.
 * @returns {Address} An address information.
 */
const getList = async (Auth = {}, conf) => {
  const {
    id,
  } = conf
  const res = await query({
    ...Auth,
  }, GET_INFO, {
    AddressId: id,
  })
  const [{ content: GetAddressInfoResult }] = extractTag('GetAddressInfoResult', res)
  const address = getInfo(GetAddressInfoResult)
  return address
}

/**
 * @typedef {Object} Config
 * @property {number} id ID of an address.
 * @typedef {Object} Address
 * @property {string} FirstName
 * @property {string} LastName
 * @property {string} JobTitle
 * @property {string} Organization
 * @property {string} Address1
 * @property {string} Address2
 * @property {string} City
 * @property {string} StateProvince
 * @property {string} StateProvinceChoice
 * @property {string} Zip
 * @property {string} Country
 * @property {string} Phone
 * @property {string} PhoneExt
 * @property {string} EmailAddress
 */

const keys = [
  'FirstName', 'LastName', 'JobTitle', 'Organization', 'Address1', 'Address2',
  'City', 'StateProvince', 'StateProvinceChoice', 'Zip', 'Country', 'Phone',
  'PhoneExt', 'EmailAddress',
]

const getInfo = (add) => {
  const res = keys.reduce((acc, key) => {
    try {
      const [{ content }] = extractTag(key, add)
      return {
        ...acc,
        [key]: content,
      }
    } catch (er) {
      throw new Error(`Could not extract tag ${key}`)
    }
  }, {})
  return res
}

export default getList
