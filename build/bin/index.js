#!/usr/bin/env node

/* eslint-disable no-console */
"use strict";

var _erte = require("erte");

var _util = require("util");

var _argufy = _interopRequireDefault(require("argufy"));

var _getUsage = _interopRequireDefault(require("./get-usage"));

var _ = require("..");

var _privateConfig = _interopRequireDefault(require("../lib/private-config"));

var _lib = require("../lib");

var _handleRequestIp = _interopRequireDefault(require("../lib/authenticate/handle-request-ip"));

var _africa = _interopRequireDefault(require("africa"));

var _questions = _interopRequireWildcard(require("../questions"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const LOG = (0, _util.debuglog)('expensive');
const DEBUG = /expensive/.test(process.env.NODE_DEBUG);
const {
  domain,
  help,
  init,
  version,
  head,
  info
} = (0, _argufy.default)({
  domain: {
    command: true
  },
  version: {
    short: 'v',
    boolean: true
  },
  help: {
    short: 'h',
    boolean: true
  },
  init: {
    short: 'I',
    boolean: true
  },
  head: {
    short: 'H',
    boolean: true
  },
  info: {
    short: 'i',
    boolean: true
  }
}, process.argv);

if (version) {
  const {
    version: v
  } = require('../../package.json');

  console.log(v);
  process.exit();
}

if (help) {
  const u = (0, _getUsage.default)();
  console.log(u);
  process.exit();
} // if (domain) {
//   const u = getUsage()
//   console.log(u)
//   console.log()
//   process.exit(1)
// }


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

const printInfo = ({
  Created,
  Expired,
  WhoisEnabled,
  Nameservers,
  EmailDetails,
  DnsProps
}) => {
  console.log('Created:\t%s', Created);
  console.log('Expires on:\t%s', Expired);
  console.log('Whois enabled:\t%s', WhoisEnabled);
  if (Nameservers) console.log('Nameservers:\t%s', Nameservers.join(', '));
  if (EmailDetails) console.log('Whois email:\t%s', EmailDetails.ForwardedTo);
  if (DnsProps) console.log('DNS:\t\t%s', (0, _erte.c)(DnsProps.ProviderType, DnsProps.ProviderType == 'FREE' ? 'red' : 'green'));
};

const run = async () => {
  const singleWord = (0, _lib.isSingleWord)(domain);
  let phone;
  let user;

  try {
    const Auth = await (0, _.getConfig)({
      global: true
    });
    const {
      aws_id,
      aws_key,
      phone: p
    } = await (0, _privateConfig.default)();
    phone = p;
    user = Auth.ApiUser;

    if (info) {
      const i = await (0, _.getInfo)(domain, Auth);
      printInfo(i);
      return;
    }

    if (singleWord) {
      await checkSingleWord(domain, Auth);
      return;
    }

    console.log('Checking domain %s', domain);
    const res = await (0, _.checkDomains)({ ...Auth,
      domain
    });

    if (res.length) {
      console.log('%s is free', (0, _erte.c)(domain, 'green'));
    } else {
      console.log('%s is taken', (0, _erte.c)(domain, 'red'));

      if (info) {
        console.log('fetching detail about the domain');
      }
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
      const authComplete = await (0, _handleRequestIp.default)(message, {
        phone,
        user,
        head
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

const Errors = {
  1011150: 'Parameter RequestIP is invalid',
  2030166: 'Domain is invalid'
};

(async () => {
  if (init) {
    await (0, _africa.default)('expensive', _questions.default, {
      force: true
    });
    await (0, _africa.default)('expensive-client', _questions.privateQuestions, {
      force: true
    });
    return;
  }

  await run();
})();
//# sourceMappingURL=index.js.map