"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = register;
exports.findDefault = void 0;

var _erte = require("erte");

var _Namecheap = _interopRequireDefault(require("../Namecheap"));

var _build = require("reloquent/build");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-line

/**
 * Find a default address ID.
 * @param {Address[]} addresses A list of addresses.
 * @returns {number} A default address ID.
 */
const findDefault = addresses => {
  const {
    AddressId
  } = addresses.find(({
    IsDefault
  }) => IsDefault) || {};
  return AddressId;
};
/** @param {Namecheap} nc */


exports.findDefault = findDefault;

async function register(nc, {
  domain
}) {
  const addresses = await nc.users.address.getList();
  const id = findDefault(addresses);
  const address = await nc.users.address.getInfo({
    id
  });
  console.log('Registering for:');
  printAddress(address);
  const y = await (0, _build.askSingle)({
    text: 'OK?',
    defaultValue: 'y'
  });
  if (y != 'y') return;
  const {
    ChargedAmount
  } = await nc.domains.create({
    domain,
    address
  });
  console.log('Successfully registered %s! Charged amount: $%s.', (0, _erte.c)(domain, 'green'), ChargedAmount);
}

const printAddress = ({
  FirstName,
  LastName,
  Address1,
  Address2,
  City,
  Zip,
  Country,
  EmailAddress
}) => {
  console.log(' %s %s, %s', FirstName, LastName, EmailAddress);
  console.log(' %s', Address1);
  Address2 && console.log(' %s', Address2);
  console.log(' %s', City);
  console.log(' %s, %s', Zip, Country);
};
//# sourceMappingURL=reg.js.map