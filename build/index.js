"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.auth = exports.checkDomains = void 0;

var _africa = _interopRequireDefault(require("africa"));

var _rqt = _interopRequireDefault(require("rqt"));

var _querystring = _interopRequireDefault(require("querystring"));

var _util = require("util");

var _questions = _interopRequireDefault(require("./questions"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const LOG = (0, _util.debuglog)('expensive');
const DOMAINS_CHECK = 'namecheap.domains.check'; // /**
//  * This is the main package file.
//  */
// export default async function expensive(Command = DOMAINS_CHECK, args = {
//   DomainList: 'random.co',
// }) {
//   console.log('expensive called')
//   const qs = querystring.stringify({
//   })
//   const url = `https://api.namecheap.com/xml.response?${qs}`
//   console.log(url)
//   const res = await rqt(url)
//   console.log(res)
// }

const validateDomains = arr => arr.reduce((acc, current) => {
  return acc && typeof current == 'string';
}, true);
/**
 * @typedef {Object} Config
 * @property {string} ApiUser username
 * @property {string} ApiKey api key from the tools
 * @property {string} ClientIp white-listed client ip
 * @property {string[]} [domains] a list of domains to check
 * @property {string} domain a single domain to check
 *
 * @param {Config} param0 config
 */


const checkDomains = async ({
  ApiUser,
  ApiKey,
  ClientIp,
  domains = [],
  domain
}) => {
  if (!Array.isArray(domains)) throw new Error('domains must be a list');
  const val = validateDomains(domains);
  if (!val) throw new Error('all domains must be strings');
  if (domain && typeof domain != 'string') throw new Error('domain must be a string');
  const d = [...domains, ...(domain ? [domain] : [])]; // const d = Array.isArray(domains) ? domains : [domain]

  const qs = _querystring.default.stringify({
    ApiUser,
    ApiKey,
    ClientIp,
    UserName: ApiUser,
    Command: DOMAINS_CHECK,
    DomainList: d.join(',')
  });

  const url = `https://api.namecheap.com/xml.response?${qs}`;
  LOG(url);
  const res = await (0, _rqt.default)(url);
  return res;
};
/**
 * @typedef {Object} AfricaOpts
 * @property {function} [rcNameFunction] a function which returns the name of the rc file to store data in, e.g., packageName => `.${packageName}rc`,
 * @property {string} [homedir] where to store the rc file.
 *
 *
 * An authentication function which will read the package's rc file, or the global expensive rc file.
 * @typedef {Object} AuthConfig
 * @property {string} [packageName] name of the package which implements the expensive API. The `.packagename-expensive.rc` file will be created in the home directory.
 * @property {boolean} [global=false] Whether to use the global expensive config.
 * @property {AfricaOpts} [opts] A configuration to pass to africa.
 *
 * @param {AuthConfig} config
 */


exports.checkDomains = checkDomains;

const auth = async (config = {}) => {
  const {
    packageName,
    global = false,
    opts = {}
  } = config;
  if (!global && !packageName) throw new Error('An implementing package name should be given if not using a global rc');
  const p = global ? 'expensive' : `${packageName}-expensive`;
  LOG('authenticating %s', p);
  const {
    ApiUser,
    ApiKey,
    ClientIp
  } = await (0, _africa.default)(p, _questions.default, opts);
  return {
    ApiUser,
    ApiKey,
    ClientIp
  };
};

exports.auth = auth;
//# sourceMappingURL=index.js.map