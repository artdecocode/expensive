"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _bosom = _interopRequireDefault(require("bosom"));

var _os = require("os");

var _path = require("path");

var _util = require("util");

var _handleRequestIp = _interopRequireDefault(require("./handle-request-ip"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const LOG = (0, _util.debuglog)('expensive');

const handleIp = async ({
  message,
  phone,
  user,
  name: appName,
  props = {}
} = {}) => {
  if (![1011150, 1].includes(props.Number)) {
    return;
  }

  const authComplete = await (0, _handleRequestIp.default)(message, {
    appName,
    phone,
    user
  });

  if (authComplete === true) {
    // update the configuration to reflect the IP
    // modify `africa` to be able to update the configuration
    const rcPath = (0, _path.resolve)((0, _os.homedir)(), `.${appName}rc`);
    LOG('writing to %s', rcPath);
    await (0, _bosom.default)(rcPath);
    return true;
  }
};

var _default = handleIp;
exports.default = _default;
//# sourceMappingURL=handle-ip.js.map