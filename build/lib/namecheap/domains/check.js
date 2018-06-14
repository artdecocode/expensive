"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = check;

var _lib = require("../../../lib");

var _query = _interopRequireDefault(require("../../../lib/query"));

var _ = require("../..");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const COMMAND = 'namecheap.domains.check';

async function check(Auth, conf) {
  const {
    domains = [],
    domain
  } = conf;
  if (!Array.isArray(domains)) throw new Error('domains must be a list');
  const val = (0, _lib.validateDomains)(domains);
  if (!val) throw new Error('all domains must be strings');
  if (domain && typeof domain != 'string') throw new Error('domain must be a string');
  const d = [...domains, ...(domain ? [domain] : [])];
  const res = await (0, _query.default)(Auth, COMMAND, {
    DomainList: d.join(',')
  });
  const DomainCheckResult = (0, _.extractTag)('DomainCheckResult', res);
  const results = DomainCheckResult.map(({
    props
  }) => props);
  return results;
}
//# sourceMappingURL=check.js.map