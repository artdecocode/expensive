"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = printList;

var _tablature = _interopRequireDefault(require("tablature"));

var _ = require("..");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function printList(domains = []) {
  if (!domains.length) {
    console.log('No domains');
    return;
  }

  const data = (0, _.mapDomains)(domains);
  const s = (0, _tablature.default)({
    keys: ['Name', 'Expiry', 'Years', 'WhoisGuard', 'DNS'],
    data,
    headings: {
      WhoisGuard: 'Whois'
    },
    replacements: {
      WhoisGuard: _.getWhois,

      DNS(val) {
        if (val) return {
          value: 'yes',
          length: 3
        };
        return {
          value: '',
          length: 0
        };
      },

      Years(value) {
        if (value) return {
          value,
          length: `${value}`.length
        };
        return {
          value: '',
          length: 0
        };
      }

    },
    centerValues: ['WhoisGuard']
  });
  console.log(s);
}
//# sourceMappingURL=list.js.map