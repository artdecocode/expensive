import query from '../../../../lib/query'
import { extractTag } from '../../..'

const COMMAND = 'namecheap.users.address.getInfo'

export default async function getList(Auth = {}, {
  id,
}) {
  const res = await query({
    ...Auth,
  }, COMMAND, {
    AddressId: id,
  })
  const [{ content: GetAddressInfoResult }] = extractTag('GetAddressInfoResult', res)
  const address = getInfo(GetAddressInfoResult)
  return address
}

const keys = [
  'AddressId', 'UserName', 'AddressName', 'Default_YN',
  'FirstName', 'LastName', 'JobTitle', 'Organization', 'Address1', 'Address2',
  'City', 'StateProvince', 'StateProvinceChoice', 'Zip', 'Country', 'Phone',
  'PhoneExt', 'EmailAddress',
]

const getInfo = (add) => {
  const res = keys
    .reduce((acc, key) => {
      try {
        let [{ content }] = extractTag(key, add)
        if (key == 'Default_YN') {
          content = content == 'true'
        } else if (key == 'AddressId') {
          content = parseInt(content, 10)
        }
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
