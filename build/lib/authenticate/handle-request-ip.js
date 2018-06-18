"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ = _interopRequireDefault(require("."));

var _chromeLauncher = require("chrome-launcher");

var _reloquent = require("reloquent");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const handleRequestIP = async (message, {
  phone,
  user,
  head
}) => {
  const _ip = /Invalid request IP: (.+)/.exec(message);

  if (!_ip) throw new Error('Could not extract IP from the error message');
  const [, ip] = _ip;
  const [password, chrome] = await Promise.all([(0, _reloquent.askSingle)({
    text: `Enter password to white-list ${ip}`
  }), (0, _chromeLauncher.launch)({
    chromeFlags: [...(head ? [] : ['--headless'
    /*, '--window-size=1000,2000'*/
    ])]
  })]);
  const res = await (0, _.default)({
    user,
    password,
    ip,
    phone,
    chrome
  });
  return res;
};

var _default = handleRequestIP;
exports.default = _default;
//# sourceMappingURL=handle-request-ip.js.map