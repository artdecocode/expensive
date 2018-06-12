"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _query = _interopRequireDefault(require("../../../lib/query"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const GET_INFO = 'namecheap.domains.getinfo';

const execRes = (re, s) => {
  const res = re.exec(s);
  if (!res) return res;
  const [, ...args] = res;
  return args;
};

const propsRe = /(\w+)="(.*?)"/g;

const extractProps = s => {
  let t;
  const r = [];

  while ((t = propsRe.exec(s)) !== null) {
    const [, key, value] = t;
    r.push({
      key,
      value
    });
  }

  return r.reduce((acc, {
    key,
    value
  }) => ({ ...acc,
    [key]: value
  }), {});
};

const extractTag = (tag, string) => {
  const re = new RegExp(`<${tag}(.*?)/?>(?:([\\s\\S]+?)</${tag}>)?`, 'g');
  const r = [];
  let t;

  while ((t = execRes(re, string)) !== null) {
    if (!t.length) continue;
    const [p, c = ''] = t;
    const props = extractProps(p);
    const item = {
      props,
      content: c.trim()
    };
    r.push(item);
  }

  return r;
};
/**
 * @param {string} domain a domain name to view info for.
 */


const getInfo = async (domain, Auth = {}) => {
  const res = await (0, _query.default)({ ...Auth
  }, GET_INFO, {
    DomainName: domain
  });
  const [{
    content: DomainDetails
  }] = extractTag('DomainDetails', res);
  const [{
    content: Created
  }] = extractTag('CreatedDate', DomainDetails);
  const [{
    content: Expired
  }] = extractTag('ExpiredDate', DomainDetails);
  const [{
    content: Whoisguard,
    props: WhoisProps
  }] = extractTag('Whoisguard', res);
  const [{
    props: EmailDetails
  } = {}] = extractTag('EmailDetails', Whoisguard);
  const [{
    content: DnsDetails,
    props: DnsProps
  }] = extractTag('DnsDetails', res);
  const Nameservers = extractTag('Nameserver', DnsDetails).map(({
    content
  }) => content);
  return {
    Created,
    Expired,
    WhoisEnabled: WhoisProps.Enabled,
    Nameservers,
    EmailDetails,
    DnsProps
  };
};

var _default = getInfo;
exports.default = _default;
//# sourceMappingURL=get-info.js.map