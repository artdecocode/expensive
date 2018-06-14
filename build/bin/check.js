"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = check;

var _erte = require("erte");

var _lib = require("../lib");

var _Namecheap = _interopRequireDefault(require("../Namecheap"));

var _tablature = _interopRequireDefault(require("tablature"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-line

/** @param {Namecheap} nc */
async function check(nc, {
  domain
}) {
  const singleWord = (0, _lib.isSingleWord)(domain);
  const domains = singleWord ? (0, _lib.makeStartupyList)(domain) : [];

  if (singleWord) {
    console.log('Checking domains %s', domains.join(', '));
  } else {
    console.log('Checking domain %s', domain);
  }

  const data = await nc.domains.check({ ...(singleWord ? {
      domains
    } : {
      domain
    })
  });
  const t = (0, _tablature.default)({
    keys: ['Domain', 'Available'],
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
      }

    },
    centerValues: ['Available']
  });
  console.log(t);
}
//# sourceMappingURL=check.js.map