import africa from 'africa'
import invalidRequestIp from '../fixtures/InvalidRequestIp'
import addresses from '../fixtures/Addresses'

process.env.SANDBOX = true

const p = africa('sandbox-expensive', {
  ApiUser: 'api user',
  ApiKey: 'api key',
})

/**
 * A testing context for the package.
 */
export default class Context {
  async _init() {
    const config = await p
    this.config = config
  }
  /**
   * Example method.
   */
  example() {
    return 'OK'
  }
  get Auth() {
    return {
      ...this.config,
      ClientIp: '127.0.0.1',
    }
  }
  get InvalidRequestIp() {
    return invalidRequestIp
  }
  get Addresses() {
    return addresses
  }
  get address() {
    return {
      Address1: 'International House',
      Address2: '24 Holborn Viaduct',
      AddressId: 837723,
      AddressName: 'Art Deco Code',
      City: 'London',
      Country: 'GB',
      Default_YN: true,
      EmailAddress: 'anton@adc.sh',
      FirstName: 'Anton',
      JobTitle: 'Director',
      LastName: 'Testt',
      Organization: 'Art Deco Code Limited',
      Phone: '+44.7881047270',
      PhoneExt: '',
      StateProvince: '',
      StateProvinceChoice: 'P',
      UserName: 'testt',
      Zip: 'EC1A 2BN',
    }
  }
  async _destroy() {
  }
}
