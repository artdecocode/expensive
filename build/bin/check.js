"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = check;

var _erte = require("erte");

var _lib = require("../lib");

var _Namecheap = _interopRequireDefault(require("../Namecheap"));

var _tablature = _interopRequireDefault(require("tablature"));

var _bosom = _interopRequireDefault(require("bosom"));

var _os = require("os");

var _path = require("path");

var _fs = require("fs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-line
const path = (0, _path.resolve)((0, _os.homedir)(), '.expensive.log');
/** @param {Namecheap} nc */

async function check(nc, {
  domains: d,
  free,
  zones = ''
}) {
  const domains = d.reduce((acc, domain) => {
    const singleWord = (0, _lib.isSingleWord)(domain);

    if (singleWord) {
      const z = zones ? zones.split(',') : [];
      const list = (0, _lib.makeList)(domain, z);
      return [...acc, ...list];
    }

    return [...acc, domain];
  }, []);
  console.log('Checking domain%s %s', domains.length > 1 ? 's' : '', domains.join(', '));
  const res = await nc.domains.check({
    domains
  });
  const data = domains.map(domain => {
    const found = res.find(({
      Domain
    }) => Domain == domain);
    return found;
  }).filter(({
    Available
  }) => {
    if (!free) return true;
    return Available;
  });
  const hasPremium = data.some(({
    IsPremiumName
  }) => IsPremiumName);
  const hasPremiumRegPrice = data.some(({
    PremiumRegistrationPrice
  }) => PremiumRegistrationPrice != '0.0000');
  const t = (0, _tablature.default)({
    keys: ['Domain', 'Available', ...(hasPremium ? ['IsPremiumName'] : []), ...(hasPremiumRegPrice ? ['PremiumRegistrationPrice'] : [])],
    data,
    replacements: {
      Available(v) {
        if (v) {
          return {
            value: (0, _erte.c)('yes', 'green'),
            length: 3
          };
        }

        return {
          value: (0, _erte.c)('no', 'red'),
          length: 2
        };
      },

      IsPremiumName(v) {
        if (!v) return empty;
        return {
          value: (0, _erte.c)('\u2713', 'green'),
          length: 1
        };
      },

      PremiumRegistrationPrice(value) {
        if (value == '0.0000') return empty;

        if (value) {
          const newValue = value.replace(/(\d+)\.(\d\d)\d\d$/, (match, p1, p2) => `${p1}.${p2}`);
          return {
            value: newValue,
            length: newValue.length
          };
        }

        return empty;
      }

    },
    headings: {
      IsPremiumName: 'Premium',
      PremiumRegistrationPrice: 'Price'
    },
    centerValues: ['Available', 'IsPremiumName']
  });
  console.log(t);
  await log(d.join(','), data);
}

const log = async (domain, data) => {
  const exists = (0, _fs.existsSync)(path);

  if (!exists) {
    await (0, _bosom.default)(path, []);
  }

  const d = await (0, _bosom.default)(path);
  const newData = [...d, {
    [domain]: data.filter(({
      Available
    }) => Available).map(({
      Domain
    }) => Domain)
  }];
  await (0, _bosom.default)(path, newData, {
    space: 2
  });
};

const empty = {
  value: '',
  length: 0
};
//# sourceMappingURL=check.js.map