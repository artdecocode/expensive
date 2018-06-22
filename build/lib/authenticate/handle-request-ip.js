"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reloquent = require("reloquent");

var _ = _interopRequireDefault(require("."));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const handleRequestIP = async (message, {
  phone,
  user
}) => {
  const _ip = /Invalid request IP: (.+)/.exec(message);

  if (!_ip) throw new Error('Could not extract IP from the error message');
  const [, ip] = _ip;
  const password = await (0, _reloquent.askSingle)({
    text: `Enter password to white-list ${ip}`
  });

  try {
    await (0, _.default)({
      user,
      password,
      ip,
      phone
    });
    return true;
  } catch ({
    message: m,
    stack
  }) {
    console.log(stack);
    return m;
  }
};

var _default = handleRequestIP;
exports.default = _default;
//# sourceMappingURL=handle-request-ip.js.map