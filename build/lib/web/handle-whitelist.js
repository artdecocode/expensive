"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _rqt = _interopRequireDefault(require("rqt"));

var _util = require("util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const LOG = (0, _util.debuglog)('expensive');

const handleWhitelist = async whitelistIp => {
  if (whitelistIp) {
    const err = new Error();
    err.props = {
      Number: 1
    };
    LOG('waiting for ip...');
    const ip = await (0, _rqt.default)('https://api.ipify.org');
    err.message = `Fake Invalid request IP: ${ip}`;
    throw err;
  }
};

var _default = handleWhitelist;
exports.default = _default;
//# sourceMappingURL=handle-whitelist.js.map