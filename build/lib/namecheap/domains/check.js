"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lib = require("../../../lib");

var _query = _interopRequireDefault(require("../../../lib/query"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const DOMAINS_CHECK = 'namecheap.domains.check';
/**
 * @typedef {Object} Config
 * @property {string} ApiUser username
 * @property {string} ApiKey api key from the tools
 * @property {string} ClientIp white-listed client ip
 * @property {string[]} [domains] a list of domains to check
 * @property {string} domain a single domain to check.
 *
 * @param {Config} config the configuration
 * @returns {string[]} an array with free domains
 */

const checkDomains = async config => {
  const {
    ApiUser,
    ApiKey,
    ClientIp,
    domains = [],
    domain
  } = config;
  if (!Array.isArray(domains)) throw new Error('domains must be a list');
  const val = (0, _lib.validateDomains)(domains);
  if (!val) throw new Error('all domains must be strings');
  if (domain && typeof domain != 'string') throw new Error('domain must be a string');
  const d = [...domains, ...(domain ? [domain] : [])];
  const res = await (0, _query.default)({
    ApiUser,
    ApiKey,
    ClientIp
  }, DOMAINS_CHECK, {
    DomainList: d.join(',')
  });
  const re = /DomainCheckResult Domain="(.+?)" Available="(true|false)"/gm;
  let e;
  const results = [];

  while (e = re.exec(res)) {
    // eslint-disable-line
    const [, name, f] = e;
    const free = f == 'true';
    results.push({
      name,
      free
    });
  }

  const f = results.filter(({
    free
  }) => free);
  const m = f.map(({
    name
  }) => name);
  return m;
};

var _default = checkDomains;
exports.default = _default;
//# sourceMappingURL=check.js.map