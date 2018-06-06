#!/usr/bin/env node

/* eslint-disable no-console */
"use strict";

var _lib = require("../lib");

var _check = _interopRequireDefault(require("../lib/namecheap/domains/check"));

var _getConfig = _interopRequireDefault(require("../lib/get-config"));

var _erte = require("erte");

var _getUsage = _interopRequireDefault(require("./get-usage"));

var _util = require("util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const LOG = (0, _util.debuglog)('expensive');
const DEBUG = /expensive/.test(process.env.NODE_DEBUG);
const [,, domain] = process.argv;

if (!domain) {
  const u = (0, _getUsage.default)();
  console.log(u);
  console.log();
  process.exit(1);
}

const checkSingleWord = async (word, auth) => {
  const domains = (0, _lib.makeStartupyList)(word);
  console.log('Checking %s domains: %s', domains.length, domains.join(', '));
  const res = await (0, _check.default)({ ...auth,
    domains
  });
  reportFree(domains, res);
};

const reportFree = (domains, freeDomains) => {
  const [free,, total] = domains.reduce(([f, t, tt], dd) => {
    const isFree = freeDomains.some(d => d == dd);
    const it = isFree ? (0, _erte.c)(dd, 'green') : (0, _erte.c)(dd, 'red');
    return [isFree ? [...f, it] : f, isFree ? t : [...t, it], [...tt, it]];
  }, [[], [], []]);
  const percent = free.length / total.length * 100;
  console.log('%s', total.join(', '));
  console.log('%s% are free', percent);
};

(async () => {
  const singleWord = (0, _lib.isSingleWord)(domain);

  try {
    const auth = await (0, _getConfig.default)({
      global: true
    });

    if (singleWord) {
      await checkSingleWord(domain, auth);
      return;
    }

    console.log('Checking domain %s', domain);
    const res = await (0, _check.default)({ ...auth,
      domain
    });

    if (res.length) {
      console.log('%s is free', (0, _erte.c)(domain, 'green'));
    } else {
      console.log('%s is taken', (0, _erte.c)(domain, 'red'));
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