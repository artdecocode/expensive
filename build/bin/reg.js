"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = register;
exports.findDefault = void 0;

var _reloquent = require("reloquent");

var _list = _interopRequireDefault(require("../lib/print/list"));

var _ = require("..");

var _Namecheap = _interopRequireDefault(require("../Namecheap"));

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
  debugger; // const address = await getAddressInfo(Auth, { id: defaultId })
}
//# sourceMappingURL=reg.js.map