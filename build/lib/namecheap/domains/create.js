"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = create;
exports.getAddressObject = void 0;

var _query = _interopRequireDefault(require("../../../lib/query"));

var _ = require("../..");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const COMMAND = 'namecheap.domains.create';

async function create(Auth, conf) {
  const {
    domain,
    years = 1,
    promo,
    address,
    nameservers = [],
    whois = true
  } = conf;
  const RegistrantAddress = getAddressObject(address, 'Registrant');
  const TechAddress = getAddressObject(address, 'Tech');
  const AdminAddress = getAddressObject(address, 'Admin');
  const AuxAddress = getAddressObject(address, 'AuxBilling');
  const res = await (0, _query.default)(Auth, COMMAND, {
    DomainName: domain,
    Years: years,
    PromotionCode: promo,
    ...RegistrantAddress,
    ...TechAddress,
    ...AdminAddress,
    ...AuxAddress,
    Nameservers: nameservers.join(','),
    AddFreeWhoisguard: whois,
    WGEnabled: whois
  });
  const [{
    props
  }] = (0, _.extractTag)('DomainCreateResult', res);
  return props;
}

const keys = ['JobTitle', 'FirstName', 'LastName', 'Address1', 'Address2', 'City', 'StateProvince', 'StateProvinceChoice', 'Country', 'Phone', 'PhoneExt', 'Fax', 'EmailAddress'];
/**
 * @param {AddressDetail} address
 */

const getAddressObject = (address, key) => {
  const res = keys.reduce((acc, current) => {
    const val = address[current];
    return { ...acc,
      [`${key}${current}`]: val
    };
  }, {
    [`${key}OrganizationName`]: address.Organization,
    [`${key}PostalCode`]: address.Zip
  });
  return res;
};

exports.getAddressObject = getAddressObject;
//# sourceMappingURL=create.js.map