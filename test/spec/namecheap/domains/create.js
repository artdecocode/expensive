import { deepEqual } from 'zoroaster/assert'
import { getAddressObject } from '../../../../src/lib/namecheap/domains/create'
import Context from '../../../context'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  async 'extracts a keyed address from a raw address'({ address }) {
    const res = getAddressObject(address, 'Registrant')
    deepEqual(res, {
      RegistrantOrganizationName: address.Organization,
      RegistrantJobTitle: address.JobTitle,
      RegistrantFirstName: address.FirstName,
      RegistrantLastName: address.LastName,
      RegistrantAddress1: address.Address1,
      RegistrantAddress2: address.Address2,
      RegistrantCity: address.City,
      RegistrantStateProvince: address.StateProvince,
      RegistrantStateProvinceChoice: address.StateProvinceChoice,
      RegistrantPostalCode: address.Zip,
      RegistrantCountry: address.Country,
      RegistrantPhone: address.Phone,
      RegistrantPhoneExt: address.PhoneExt,
      RegistrantFax: address.Fax,
      RegistrantEmailAddress: address.EmailAddress,
    })
  },
}

export default T
