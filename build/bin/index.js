#!/usr/bin/env node

/* eslint-disable no-console */
"use strict";

var _ = require("..");

var _erte = require("erte");

var _getUsage = _interopRequireDefault(require("./get-usage"));

var _util = require("util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const LOG = (0, _util.debuglog)('expensive');
const DEBUG = /expensive/.test(process.env.NODE_DEBUG);
const [,, _d0, _d1] = process.argv;
const domain = _d1 ? _d1 : _d0;

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

    if (single) {
      let green = 0;
      let red = 0;
      domains.forEach(dd => {
        const s = [];
        let t;

        if (res.indexOf(dd) >= 0) {
          t = (0, _erte.c)(dd, 'green');
          green++;
        } else {
          t = (0, _erte.c)(dd, 'red');
          red++;
        }

        s.push(t);
        console.log('%s', s.join(' '));
      });
      console.log('%s% are free', green / (green + red) * 100);
    } else {
      if (res.length) {
        console.log('%s is free', (0, _erte.c)(domain, 'green'));
      } else {
        console.log('%s is taken', (0, _erte.c)(domain, 'red'));
      }
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