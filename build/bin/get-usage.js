"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _usually = _interopRequireDefault(require("usually"));

var _lib = require("../lib");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const l = _lib.allZones.join(', ');

var _default = () => {
  const u = (0, _usually.default)({
    usage: {
      domain: `check a domain name in a number of zones\n(${l})`,
      'domain.co': 'check a domain name',
      '-f': 'display only free domains when checking',
      '-z co,io': 'check in these zones only',
      '-i, --info': 'display info on domain',
      // '-r, --register': 'register a domain',
      // '-r53, --route53': 'assign a hosted zone',
      '-I, --init': 'interactively initialise the configuration',
      '-h, --help': 'print usage information',
      '-v, --version': 'print package\'s version',
      '-H, --head': 'don\'t use headless Chrome for auth'
    },
    description: 'A CLI application to access namecheap.com domain name registrar API.\nSee man expensive for more information.',
    line: 'expensive [domain.co [domain.cc]] -f -z co[,io,app] -i -IHhv'
  });
  return u;
};

exports.default = _default;
//# sourceMappingURL=get-usage.js.map