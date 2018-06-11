#!/usr/bin/env node

/* eslint-disable no-console */
"use strict";

var _erte = require("erte");

var _util = require("util");

var _reloquent = require("reloquent");

var _argufy = _interopRequireDefault(require("argufy"));

var _getUsage = _interopRequireDefault(require("./get-usage"));

var _ = require("..");

var _privateConfig = _interopRequireDefault(require("../lib/private-config"));

var _lib = require("../lib");

var _authenticate = _interopRequireDefault(require("../lib/authenticate"));

var _chromeLauncher = require("chrome-launcher");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const LOG = (0, _util.debuglog)('expensive');
const DEBUG = /expensive/.test(process.env.NODE_DEBUG);
const {
  domain,
  help
} = (0, _argufy.default)({
  domain: {
    command: true
  },
  help: 'h'
}, process.argv);

if (help) {
  const u = (0, _getUsage.default)();
  console.log(u);
  process.exit();
}

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
    const { ...auth
    } = await (0, _.getConfig)({
      global: true
    });
    const {
      aws_id,
      aws_key,
      phone: p
    } = await (0, _privateConfig.default)();
    phone = p;
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
        await run(); // update the configuration to reflect the IP
        // modify `africa` to be able to update the configuration
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
  const [password, chrome] = await Promise.all([(0, _reloquent.askSingle)({
    text: `Enter password to white-list ${ip}`
  }), (0, _chromeLauncher.launch)({
    startingUrl: 'https://www.namecheap.com/myaccount/login.aspx',
    chromeFlags: [// userDataDir,
      // '--headless', '--disable-gpu', '--window-size=1000,2000'
    ]
  })]);
  const res = await (0, _authenticate.default)({
    user,
    password,
    ip,
    phone,
    chrome
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