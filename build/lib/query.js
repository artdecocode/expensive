"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = query;
exports.getError = void 0;

var _rqt = _interopRequireDefault(require("rqt"));

var _querystring = require("querystring");

var _util = require("util");

var _erotic = _interopRequireDefault(require("erotic"));

var _ = require(".");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const LOG = (0, _util.debuglog)('expensive');
/** @param {string} s */

const isXml = s => s.startsWith('<?xml version="1.0" encoding="utf-8"?>');

async function query({
  ApiUser,
  ApiKey,
  ClientIp
}, Command, Options = {}) {
  const cb = (0, _erotic.default)(true);
  if (!Command) throw new Error('Command must be passed');
  const qs = (0, _querystring.stringify)({
    ApiUser,
    ApiKey,
    UserName: ApiUser,
    ClientIp,
    Command,
    ...Options
  });
  const url = `https://api.${process.env.SANDBOX ? 'sandbox.' : ''}namecheap.com/xml.response?${qs}`;
  LOG(url);
  const res = await (0, _rqt.default)(url);
  const xml = isXml(res);
  if (!xml) throw new Error('non-xml response');
  const error = getError(res);

  if (error) {
    throw cb(error);
  }

  const [{
    content: CommandResponse
  }] = (0, _.extractTag)('CommandResponse', res);
  return CommandResponse;
}

const getError = res => {
  const [{
    content: Errors
  }] = (0, _.extractTag)('Errors', res);

  if (Errors.length) {
    const errors = (0, _.extractTag)('Error', Errors);
    let c;
    let p;

    if (errors.length == 1) {
      const [{
        content,
        props
      }] = errors;
      c = content;
      p = props;
    } else {
      c = errors.map(({
        content
      }) => content).join('; ');
      p = errors.map(({
        props
      }) => props);
    }

    const er = new Error(c);
    er.props = p;
    return er;
  }
};

exports.getError = getError;
//# sourceMappingURL=query.js.map