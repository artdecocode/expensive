"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getList;

var _util = require("util");

var _query = _interopRequireDefault(require("../../../../lib/query"));

var _ = require("../../..");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const LOG = (0, _util.debuglog)('expensive');
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

const keys = ['AddressId', 'UserName', 'AddressName', 'Default_YN', 'FirstName', 'LastName', 'JobTitle', 'Organization', 'Address1', 'Address2', 'City', 'StateProvince', 'StateProvinceChoice', 'Zip', 'Country', 'Phone', 'PhoneExt', 'EmailAddress'];

const getInfo = add => {
  const res = keys.reduce((acc, key) => {
    try {
      let [{
        content
      }] = (0, _.extractTag)(key, add);

      if (key == 'Default_YN') {
        content = content == 'true';
      } else if (key == 'AddressId') {
        content = parseInt(content, 10);
      }

      return { ...acc,
        [key]: content
      };
    } catch (er) {
      LOG(`Could not extract tag ${key}`);
      return acc;
    }
  }, {});
  return res;
};
//# sourceMappingURL=get-info.js.map