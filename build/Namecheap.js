"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AddressDetail = exports.DomainInfo = exports.default = void 0;

var _check = _interopRequireDefault(require("./lib/namecheap/domains/check"));

var _create = _interopRequireDefault(require("./lib/namecheap/domains/create"));

var _getList = _interopRequireDefault(require("./lib/namecheap/domains/get-list"));

var _getInfo = _interopRequireDefault(require("./lib/namecheap/domains/get-info"));

var _getList2 = _interopRequireDefault(require("./lib/namecheap/users/address/get-list"));

var _getInfo2 = _interopRequireDefault(require("./lib/namecheap/users/address/get-info"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Namecheap {
  /**
   * Create an instance of a Namecheap client.
   * @param {Auth} Auth Authentication object.
   */
  constructor(Auth) {
    if (!Auth) throw new Error('Authentication object expected');
    this.Auth = Auth;
  }

  get users() {
    return {
      address: {
        /**
         * Gets a list of address IDs and address names associated with the user account.
         * @returns {Promise.<Address[]>} An array with addresses.
         * @example
         *
         * await nc.users.address.getList()
         */
        getList: async conf => {
          const res = await (0, _getList2.default)(this.Auth, conf);
          return res;
        },

        /**
         * Gets information for the requested address ID.
         * @param {users.address.getInfo} conf Configuration parameters.
         * @param {number} conf.id ID of the address.
         * @returns {Promise.<AddressDetail>} Full information about the address.
         * @example
         *
         * await nc.users.address.getInfo({ id: 335544 })
         *
         */
        getInfo: async conf => {
          const res = await (0, _getInfo2.default)(this.Auth, conf);
          return res;
        }
      }
    };
  } // get whoisguard() {
  //   return {
  //     /**
  //      * Allots WhoisGuard privacy protection to a domain.
  //      * @param {whoisguard.allot} conf Configuration parameters.
  //      * @param {string} conf.domain A domain name to register.
  //      * @param {AddressDetail} conf.address An address to use for all fields.
  //      * @returns {Promise.<RegistrationResult>} Result of the domain registration process.
  //      */
  //     allot: async (conf) => {
  //       const res = await allot(this.Auth, conf)
  //       return res
  //     },
  //   }
  // }


  get domains() {
    return {
      /**
       * Registers a new domain.
       * @param {domains.create} conf Configuration parameters.
       * @param {string} conf.domain A domain name to register.
       * @param {AddressDetail} conf.address An address to use for all fields.
       * @returns {Promise.<RegistrationResult>} Result of the domain registration process.
       */
      create: async conf => {
        const res = await (0, _create.default)(this.Auth, conf);
        return res;
      },

      /**
       * Checks the availability of domains.
       * @param {domains.check} conf Configuration parameters.
       * @param {string} [conf.domain] A single domain to check.
       * @param {string[]} [conf.domains] An array of domains to check.
       * @returns {Promise.<DomainCheck[]>} An array with information about checked domains.
       * @example
       *
       * await nc.domains.check({ domain: 'test.co' })
       */
      check: async conf => {
        const res = await (0, _check.default)(this.Auth, conf);
        return res;
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
       * @returns {Promise.<{domains: DomainListInfo[], TotalItems: number, CurrentPage: number, PageSize: number}>} Domains with paging information.
       * @example
       *
       * // Get information about domains in the `.app` zone sorted by descending create date (oldest first)
       * await nc.domains.getList({
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
      getList: async (conf = {}) => {
        const res = await (0, _getList.default)(this.Auth, conf);
        return res;
      },

      /**
       * Returns information about the requested domain.
       * @param {domains.getInfo} conf Configuration parameters.
       * @param {string} conf.domain Domain name to get information for.
       * @returns {Promise.<DomainInfo>} An information about the domain.
       * @example
       *
       * // Obtain information for the testt.cc domain:
       * await nc.domains.getInfo({ domain: 'testt.cc' })
       *
       * // Result:
       * { Status: 'Ok',
       *  ID: 30072635,
       *  DomainName: 'testt.cc',
       *  OwnerName: 'artdeco',
       *  IsOwner: true,
       *  IsPremium: false,
       *  DomainDetails:
       *   { CreatedDate: '06/06/2018',
       *     ExpiredDate: '06/06/2019',
       *     NumYears: 0 },
       *  Whoisguard:
       *   { Enabled: 'True',
       *     ID: 23996873,
       *     ExpiredDate: '06/05/2019',
       *     EmailDetails:
       *      { WhoisGuardEmail: 'ff474db8ad3b4c3b95a2b0f3b3a73acc.protect[at]whoisguard.com',
       *        ForwardedTo: 'anton[at]adc.sh',
       *        LastAutoEmailChangeDate: '',
       *        AutoEmailChangeFrequencyDays: 0 } },
       *  PremiumDnsSubscription:
       *   { UseAutoRenew: false,
       *     SubscriptionId: -1,
       *     CreatedDate: 0001-01-01T00:00:00.000Z,
       *     ExpirationDate: 0001-01-01T00:00:00.000Z,
       *     IsActive: false },
       *  DnsDetails:
       *   { ProviderType: 'CUSTOM',
       *     IsUsingOurDNS: false,
       *     HostCount: 2,
       *     EmailType: 'FWD',
       *     DynamicDNSStatus: false,
       *     IsFailover: false,
       *     Nameserver:
       *      [ 'ns-1013.awsdns-62.net',
       *        'ns-1311.awsdns-35.org',
       *        'ns-1616.awsdns-10.co.uk',
       *        'ns-355.awsdns-44.com' ] },
       *  Modificationrights: { All: true } }
       */
      getInfo: async (conf = {}) => {
        const res = await (0, _getInfo.default)(this.Auth, conf);
        return res;
      }
    };
  }

} // const nc = new Namecheap()
// nc.domains.check

/** @type {DomainInfo} */


exports.default = Namecheap;
const DomainInfo = {};
/** @type {AddressDetail} */

exports.DomainInfo = DomainInfo;
const AddressDetail = {};
/**
 * @typedef {Object} Auth
 * @property {string} ApiUser Username required to access the API.
 * @property {string} ApiKey Password required used to access the API.
 * @property {string} ClientIp IP address of the client accessing your application (End-user IP address).
 */

/**
 * @typedef {Object} users.address.getInfo
 * @property {number} id ID of the address.
 *
 * @typedef {Object} domains.create
 * @property {string} domain A domain name to register.
 * @property {AddressDetail} address An address to use for all fields.
 *
 * @typedef {Object} domains.getInfo
 * @property {string} domain Domain name to get information for.
 *
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
 * @typedef {Object} DomainListInfo
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
 *
 * @typedef Address
 * @property {number} AddressID A unique integer value that represents the address profile.
 * @property {number} AddressName The name of the address profile.
 * @property {boolean} IsDefault Whether it is a default address.
 *
 * @typedef {Object} AddressDetail
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

/**
 * @typedef {Object} DomainInfo
 * @property {string} DomainName
 * @property {number} ID
 * @property {boolean} IsOwner
 * @property {boolean} IsPremium
 * @property {string} OwnerName
 * @property {string} Status
 * @property {DomainDetails} DomainDetails
 * @property {LockDetails} LockDetails
 * @property {Whoisguard} Whoisguard
 * @property {PremiumDnsSubscription} PremiumDnsSubscription
 * @property {DnsDetails} DnsDetails
 * @property {ModificationRights} ModificationRights
 *
 * @typedef {Object} LockDetails
 *
 * @typedef {Object} DomainDetails
 * @property {string} CreatedDate
 * @property {string} ExpiredDate
 * @property {number} NumYears
 *
 * @typedef {Object} DnsDetails
 * @property {('CUSTOM'|'FREE')} ProviderType
 * @property {boolean} IsUsingOurDNS
 * @property {number} HostCount
 * @property {string} EmailType
 * @property {boolean} DynamicDNSStatus
 * @property {boolean} IsFailover
 * @property {string[]} Nameserver
 *
 * @typedef {Object} PremiumDnsSubscription
 * @property {Date} CreatedDate
 * @property {Date} ExpirationDate
 * @property {boolean} IsActive
 * @property {number} SubscriptionId
 * @property {boolean} UseAutoRenew
 *
 * @typedef {Object} Whoisguard
 * @property {string} Enabled
 * @property {number} ID
 * @property {string} [ExpiredDate]
 * @property {EmailDetails} [EmailDetails]
 *
 * @typedef {Object} ModificationRights
 * @property {boolean} All
 * @property {boolean} [hosts]
 *
 * @typedef {Object} EmailDetails
 * @property {number} AutoEmailChangeFrequencyDays
 * @property {string} ForwardedTo
 * @property {string} LastAutoEmailChangeDate
 * @property {string} WhoisGuardEmail
 *
 * @typedef {Object} RegistrationResult
 * @property {string} ChargedAmount
 * @property {string} Domain
 * @property {boolean} FreePositiveSSL
 * @property {boolean} NonRealTimeDomain
 * @property {number} OrderID
 * @property {boolean} Registered
 * @property {number} TransactionID
 * @property {boolean} WhoisguardEnable
 */

exports.AddressDetail = AddressDetail;
//# sourceMappingURL=Namecheap.js.map