import query from '../../../../lib/query'
import { extractTag } from '../../..'

const GET_INFO = 'namecheap.users.address.getInfo'

/**
 * @param {string} domain a domain name to view info for.
 */
const getList = async (Auth = {}, {
  id,
}) => {
  const res = await query({
    ...Auth,
  }, GET_INFO, {
    AddressId: id,
  })
  const [{ content: GetAddressInfoResult }] = extractTag('GetAddressInfoResult', res)
  const address = getInfo(GetAddressInfoResult)
  return address
}

const keys = ['FirstName', 'LastName', 'JobTitle', 'Organization', 'Address1', 'Address2', 'City', 'StateProvince', 'StateProvinceChoice', 'Zip', 'Country', 'Phone', 'PhoneExt', 'EmailAddress']

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
