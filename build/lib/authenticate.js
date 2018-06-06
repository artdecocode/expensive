"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _rqt = _interopRequireDefault(require("rqt"));

var _path = require("path");

var _fs = require("fs");

var _util = require("util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const LOG = (0, _util.debuglog)('expensive');
let version = 'unknown';

try {
  const path = (0, _path.resolve)(__dirname, '../../package.json');
  const f = (0, _fs.readFileSync)(path);
  ({
    version
  } = JSON.parse(f));
} catch (err) {
  /**/
}

const authenticate = async () => {
  const ua = `Mozilla/5.0 Expensive (v${version}) https://npmjs.org/package/expensive`;
  LOG(ua);
  await (0, _rqt.default)('https://www.namecheap.com/myaccount/login.aspx', {
    headers: {
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'en-US,en',
      'User-Agent': ua
    }
  });
};

var _default = authenticate;
exports.default = _default;
//# sourceMappingURL=authenticate.js.map