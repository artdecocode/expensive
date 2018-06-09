"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _usually = _interopRequireDefault(require("usually"));

var _lib = require("../lib");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const l = _lib.startupyDomains.join(', ');

var _default = () => {
  const u = (0, _usually.default)({
    usage: {
      domain: `check a domain name in various tech zones\n(${l})`,
      'domain.com': 'check a domain name',
      '-h, --help': 'print usage information'
    },
    description: 'A CLI application to access namecheap.com via API.',
    line: 'expensive [command]'
  });
  return u;
};

exports.default = _default;
//# sourceMappingURL=get-usage.js.map