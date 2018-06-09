"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _africa = _interopRequireDefault(require("africa"));

var _questions = require("../questions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @typedef  {Object} AppConfig
 * @property {string} DefaultPhone Last 3 digits of the phone number
 */
var _default = async () => {
  const {
    aws_id,
    aws_key,
    phone
  } = await (0, _africa.default)('expensive-client', _questions.privateQuestions);
  return {
    aws_id,
    aws_key,
    phone
  };
};

exports.default = _default;
//# sourceMappingURL=private-config.js.map