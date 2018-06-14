"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getList;

var _query = _interopRequireDefault(require("../../../../lib/query"));

var _ = require("../../..");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const COMMAND = 'namecheap.users.address.getList';

async function getList(Auth = {}) {
  const res = await (0, _query.default)({ ...Auth
  }, COMMAND);
  const [{
    content: AddressGetListResult
  }] = (0, _.extractTag)('AddressGetListResult', res);
  const List = (0, _.extractTag)('List', AddressGetListResult);
  const addresses = List.map(({
    props
  }) => props);
  return addresses;
}
/**
 * @typedef Address
 * @property {number} AddressID A unique integer value that represents the address profile.
 * @property {number} AddressName The name of the address profile.
 * @property {boolean} IsDefault Whether it is a default address.
 */
//# sourceMappingURL=get-list.js.map