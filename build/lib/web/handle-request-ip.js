"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reloquent = require("reloquent");

var _bosom = _interopRequireDefault(require("bosom"));

var _authenticate = _interopRequireDefault(require("../authenticate"));

var _util = require("util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const LOG = (0, _util.debuglog)('expensive');

const handleRequestIP = async (message, {
  appName,
  phone,
  user
}) => {
  const _ip = /Invalid request IP: (.+)/.exec(message);

  if (!_ip) throw new Error('Could not extract IP from the error message');
  const [, ip] = _ip;
  let p;

  try {
    p = await (0, _bosom.default)(`.${appName}-password`);
  } catch (err) {
    LOG('%s password file not found', appName);
  }

  const password = p || (await (0, _reloquent.askSingle)({
    text: `Enter password to white-list ${ip}`
  }));
  await (0, _authenticate.default)({
    user,
    password,
    ip,
    phone
  });
};

var _default = handleRequestIP;
exports.default = _default;
//# sourceMappingURL=handle-request-ip.js.map