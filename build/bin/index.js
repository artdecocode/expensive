#!/usr/bin/env node

/* eslint-disable no-console */
"use strict";

var _util = require("util");

var _ = require("..");

var _getUsage = _interopRequireDefault(require("./get-usage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const LOG = (0, _util.debuglog)('expensive');
const DEBUG = /expensive/.test(process.env.NODE_DEBUG);
const [,, d0, d1] = process.argv;
const domain = d1 ? d1 : d0;

const isSingleWord = d => !/\./.test(d);

const startupyDomains = ['.co', '.cc', '.io', '.bz', '.app'];

const makeList = d => startupyDomains.map(s => `${d}${s}`); // const usa = us.reduce((acc, length, i) => {
//   const command = commands[i]
//   const s = pad(command, i)
//   return [...acc, s]
// }, [])


const findTaken = (free, total) => {
  const res = total.filter(t => {
    const f = free.indexOf(t) < 0;
    return f;
  });
  return res;
};

(async () => {
  if (!domain) {
    const u = (0, _getUsage.default)();
    console.log(u);
    console.log();
    process.exit(1);
  }

  const single = isSingleWord(domain);
  const domains = single ? makeList(domain) : [];
  const d = single ? undefined : domain; // const sd = single ? startupyDomains.map(d => `${domain}${d}`).join(', ') : { length: 1 }
  // const { l } = sd

  try {
    const a = await (0, _.auth)({
      global: true
    });

    if (single) {
      console.log('Checking %s domains: %s', domains.length, domains.join(', '));
    } else if (domain) {
      console.log('Checking domain %s', domain);
    }

    const res = await (0, _.checkDomains)({ ...a,
      domain: d,
      domains
    });
    const d1 = res.length;

    if (d1) {
      const d2 = domains.length;
      console.log('%d/%d are free: %s', d1, d2, res.join(', '));
      const taken = findTaken(res, domains);
      console.log('%d/%d are taken: %s', d2 - d1, d2, taken.join(', '));
    } else if (single) {
      console.log('None of the zones are available.');
    } else if (domain) {
      console.log('Domain %s is not available', domain);
    }
  } catch ({
    stack,
    message
  }) {
    DEBUG ? LOG(stack) : console.error(message);
    process.exit(1);
  }
})();
//# sourceMappingURL=index.js.map