"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "checkDomains", {
  enumerable: true,
  get: function () {
    return _check.default;
  }
});
Object.defineProperty(exports, "getInfo", {
  enumerable: true,
  get: function () {
    return _getInfo.default;
  }
});
Object.defineProperty(exports, "getConfig", {
  enumerable: true,
  get: function () {
    return _getConfig.default;
  }
});

var _check = _interopRequireDefault(require("./lib/namecheap/domains/check"));

var _getInfo = _interopRequireDefault(require("./lib/namecheap/domains/get-info"));

var _getConfig = _interopRequireDefault(require("./lib/get-config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=index.js.map