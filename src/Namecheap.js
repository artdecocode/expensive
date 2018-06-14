import check from './lib/namecheap/domains/check'
import getList from './lib/namecheap/domains/get-list'

export default class Namecheap {
  /**
   * Create an instance of a Namecheap client.
   * @param {Auth} Auth Authentication object.
   */
  constructor(Auth) {
    if (!Auth) throw new Error('Authentication object expected')
    this.Auth = Auth
  }
  get domains() {
    return {
      /**
       * Checks the availability of domains.
       * @param {domains.check} conf Configuration parameters.
       * @param {string} [conf.domain] A single domain to check.
       * @param {string[]} [conf.domains] An array of domains to check.
       * @returns {Promise.<DomainCheck[]>} An array with information about checked domains.
       * @example
       *
       * const res = await nc.domains.check({ domain: 'test.co' })
       */
      check: async(conf) => {
        const res = await check(this.Auth, conf)
        return res
      },
      /**
       * Returns a list of domains for the particular user.
       * @param {domains.getList} [conf] Configuration parameters.
       * @param {('create'|'expire'|'name')} [conf.sort] How to sort the results. Defaults to expiry date.
       * @param {boolean} [conf.desc] Whether to display in descending order when using a sort.
       * @param {number} [conf.page] Page to return.
       * @param {string} [conf.filter] Search term to filter results by.
       * @param {('all'|'expiring'|'expired')} [conf.type] What domains to show.
       * @param {number} [conf.pageSize] Number of domains to be listed on a page. Minimum value is *10*, and maximum value is *100*. Default value is *20*.
       * @returns {Promise.<{domains: DomainInfo[], TotalItems: number, CurrentPage: number, PageSize: number}>} Domains with paging information.
       * @example
       *
       * // Get information about domains in the `.app` zone sorted by descending create date (oldest first)
       * const res = await nc.domains.getList({
       *  sort: 'create',
       *  desc: true,
       *  filter: '.app',
       * })
       *
       * // Result:
       * {
       *  domains: [
       *    {
       *      ID: 30071047,
       *      Name: 'example.app',
       *      User: 'artdeco',
       *      Created: '06/05/2018',
       *      Expires: '06/05/2019',
       *      IsExpired: false,
       *      IsLocked: false,
       *      AutoRenew: true,
       *      WhoisGuard: 'ENABLED',
       *      IsPremium: false,
       *      IsOurDNS: false
       *    },
       *    {
       *      ID: 30072635,
       *      Name: 'test.app',
       *      User: 'artdeco',
       *      Created: '06/06/2018',
       *      Expires: '06/06/2019',
       *      IsExpired: false,
       *      IsLocked: false,
       *      AutoRenew: true,
       *      WhoisGuard: 'ENABLED',
       *      IsPremium: false,
       *      IsOurDNS: false
       *    },
       *  ],
       *  TotalItems: 46,
       *  CurrentPage: 1,
       *  PageSize: 20,
       * }
       */
      getList: async(conf = {}) => {
        const res = await getList(this.Auth, conf)
        return res
      },
    }
  }
}

// const nc = new Namecheap()
// nc.domains.check

/**
 * @typedef {Object} Auth
 * @property {string} ApiUser Username required to access the API.
 * @property {string} ApiKey Password required used to access the API.
 * @property {string} ClientIp IP address of the client accessing your application (End-user IP address).
 */

/**
 * @typedef {Object} domains.check
 * @property {string} domain A single domain to check.
 * @property {string[]} domains An array of domains to check.
 *
 * @typedef {Object} domains.getList
 * @property {('create'|'expire'|'name')} [sort] How to sort the results. Defaults to expiry date.
 * @property {boolean} [desc] Whether to display in descending order when using a sort.
 * @property {number} [page] Page to return.
 * @property {string} [filter] Search term to filter results by.
 * @property {('all'|'expiring'|'expired')} [type] What domains to show.
 * @property {number} [pageSize] Number of domains to be listed on a page. Minimum value is *10*, and maximum value is *100*. Default value is *20*.
 *
 * @typedef {Object} DomainInfo
 * @property {boolean} AutoRenew
 * @property {string} Created
 * @property {string} Expires
 * @property {number} ID
 * @property {boolean} IsExpired
 * @property {boolean} IsLocked
 * @property {boolean} IsOurDNS
 * @property {boolean} IsPremium
 * @property {string} Name
 * @property {string} User
 * @property {string} WhoisGuard
 *
 * @typedef {Object} DomainCheck
 * @property {boolean} Available
 * @property {string} Description
 * @property {string} Domain
 * @property {number} EapFee
 * @property {number} ErrorNo
 * @property {number} IcannFee
 * @property {boolean} IsPremiumName
 * @property {number} PremiumRegistrationPrice
 * @property {number} PremiumRenewalPrice
 * @property {number} PremiumRestorePrice
 * @property {number} PremiumTransferPrice
 */
