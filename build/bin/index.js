#!/usr/bin/env node

/* eslint-disable no-console */
"use strict";

var _erte = require("erte");

var _util = require("util");

var _getUsage = _interopRequireDefault(require("./get-usage"));

var _ = require("..");

var _lib = require("../lib");

var _authenticate = _interopRequireDefault(require("../lib/authenticate"));

var _reloquent = require("reloquent");

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
  const res = await (0, _.checkDomains)({ ...auth,
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

const run = async () => {
  const singleWord = (0, _lib.isSingleWord)(domain);
  let phone;
  let user;

  try {
    const {
      DefaultPhone,
      ...auth
    } = await (0, _.getConfig)({
      global: true
    });
    phone = DefaultPhone;
    user = auth.ApiUser;

    if (singleWord) {
      await checkSingleWord(domain, auth);
      return;
    }

    console.log('Checking domain %s', domain);
    const res = await (0, _.checkDomains)({ ...auth,
      domain
    });

    if (res.length) {
      console.log('%s is free', (0, _erte.c)(domain, 'green'));
    } else {
      console.log('%s is taken', (0, _erte.c)(domain, 'red'));
    }
  } catch ({
    stack,
    message,
    props
  }) {
    if (props) {
      LOG((0, _util.inspect)(props, {
        colors: true
      }));
      LOG(Errors[props.Number]);
    }

    if (props && props.Number == '1011150') {
      const authComplete = await handleRequestIP(message, {
        phone,
        user
      });

      if (authComplete === true) {
        await run();
      } else {
        console.log(authComplete);
      }

      return;
    }

    DEBUG ? LOG(stack) : console.error(message);
    process.exit(1);
  }
};

const handleRequestIP = async (message, {
  phone,
  user
}) => {
  const _ip = /Invalid request IP: (.+)/.exec(message);

  if (!_ip) throw new Error('Could not extract IP from the error message');
  const [, ip] = _ip;
  const password = await (0, _reloquent.askSingle)({
    text: `Enter password to white-list ${ip}`
  });
  const res = await (0, _authenticate.default)({
    user,
    password,
    ip,
    phone
  });
  return res;
};

const Errors = {
  1011150: 'Parameter RequestIP is invalid'
};

(async () => {
  await run();
})();
//# sourceMappingURL=index.js.map