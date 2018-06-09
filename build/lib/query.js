"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _rqt = _interopRequireDefault(require("rqt"));

var _querystring = require("querystring");

var _util = require("util");

var _erotic = _interopRequireDefault(require("erotic"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const LOG = (0, _util.debuglog)('expensive');
/** @param {string} s */

const isXml = s => s.startsWith('<?xml version="1.0" encoding="utf-8"?>');

const query = async ({
  ApiUser,
  ApiKey,
  ClientIp
}, Command, Options = {}) => {
  const cb = (0, _erotic.default)();
  if (!Command) throw new Error('Command must be passed');
  const qs = (0, _querystring.stringify)({
    ApiUser,
    ApiKey,
    UserName: ApiUser,
    ClientIp,
    Command,
    ...Options
  });
  const url = `https://api.namecheap.com/xml.response?${qs}`;
  LOG(url);
  const res = await (0, _rqt.default)(url);
  const xml = isXml(res);
  if (!xml) throw new Error('non-xml response');
  const re = /<Errors>([\s\S.]+?)<\/Errors>/;
  const e = re.exec(res);

  if (e) {
    const [, ...er] = e;
    const errors = er.map(r => r.trim()).map(r => {
      const re1 = /<Error(.*?)>(.+?)<\/Error>/;
      const e1 = re1.exec(r);

      if (!e1) {
        LOG(e1);
        return `Could not parse the error: ${r}`;
      }

      const [, xmlProps, title] = e1;
      const props = xmlProps.trim().split(' ').reduce((acc, p) => {
        const e2 = /(.+?)="(.+?)"/.exec(p);

        if (!e2) {
          LOG(e2);
          return 'could not parse the property';
        }

        const [, prop, value] = e2;
        const d = {
          [prop]: value
        };
        return { ...acc,
          ...d
        };
      }, {});
      return {
        title,
        props
      };
    });
    let ero;

    if (errors.length == 1) {
      const [{
        title,
        props
      }] = errors;
      ero = new Error(title);
      ero.props = props;
    } else {
      const t = errors.map(({
        title
      }) => title).join('; ');
      ero = new Error(t);
      ero.props = errors.map(({
        props
      }) => props);
    }

    const transparentError = cb(ero);
    throw transparentError;
  }

  return res;
};

var _default = query;
exports.default = _default;
//# sourceMappingURL=query.js.map