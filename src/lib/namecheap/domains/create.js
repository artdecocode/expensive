import query from '../../../lib/query'
import { extractTag } from '../..'

const COMMAND = 'namecheap.domains.create'

export default async function create(Auth, conf) {
  const {
    domain,
    years = 1,
    promo,
    address,
    nameservers = [],
    whois = true,
  } = conf
  const RegistrantAddress = getAddressObject(address, 'Registrant')
  const TechAddress = getAddressObject(address, 'Tech')
  const AdminAddress = getAddressObject(address, 'Admin')
  const AuxAddress = getAddressObject(address, 'AuxBilling')

  const res = await query(Auth, COMMAND, {
    DomainName: domain,
    Years: years,
    PromotionCode: promo,
    ...RegistrantAddress,
    ...TechAddress,
    ...AdminAddress,
    ...AuxAddress,
    Nameservers: nameservers.join(','),
    AddFreeWhoisguard: whois,
    WGEnabled: whois,
  })
  const [{ props }] = extractTag('DomainCreateResult', res)
  return props
}

const keys = ['JobTitle', 'FirstName', 'LastName', 'Address1', 'Address2',
  'City', 'StateProvince', 'StateProvinceChoice', 'Country',
  'Phone', 'PhoneExt', 'Fax', 'EmailAddress']

/**
 * @param {AddressDetail} address
 */
export const getAddressObject = (address, key) => {
  const res = keys
    .reduce((acc, current) => {
      const val = (current == 'StateProvince' && !address[current]) ? 'NA' : address[current]
      return {
        ...acc,
        [`${key}${current}`]: val,
      }
    }, {
      [`${key}OrganizationName`]: address.Organization,
      [`${key}PostalCode`]: address.Zip,
    })
  return res
}
