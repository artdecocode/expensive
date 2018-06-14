"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getList;

var _query = _interopRequireDefault(require("../../../../lib/query"));

var _ = require("../../..");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const COMMAND = 'namecheap.users.address.getInfo';

async function getList(Auth = {}, {
  id
}) {
  const res = await (0, _query.default)({ ...Auth
  }, COMMAND, {
    AddressId: id
  });
  const [{
    content: GetAddressInfoResult
  }] = (0, _.extractTag)('GetAddressInfoResult', res);
  const address = getInfo(GetAddressInfoResult);
  return address;
}

const keys = ['FirstName', 'LastName', 'JobTitle', 'Organization', 'Address1', 'Address2', 'City', 'StateProvince', 'StateProvinceChoice', 'Zip', 'Country', 'Phone', 'PhoneExt', 'EmailAddress'];

const getInfo = add => {
  const res = keys.reduce((acc, key) => {
    try {
      const [{
        content
      }] = (0, _.extractTag)(key, add);
      return { ...acc,
        [key]: content
      };
    } catch (er) {
      throw new Error(`Could not extract tag ${key}`);
    }
  }, {});
  return res;
};
//# sourceMappingURL=get-info.js.map