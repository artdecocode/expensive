"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getInfo;
exports.parse = void 0;

var _query = _interopRequireDefault(require("../../query"));

var _ = require("../..");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const COMMAND = 'namecheap.domains.getinfo';

const parseWhois = Whoisguard => {
  let ID;
  let ExpiredDate;
  let EmailDetails;
  [{
    content: ID
  }] = (0, _.extractTag)('ID', Whoisguard);

  try {
    [{
      props: EmailDetails
    }] = (0, _.extractTag)('EmailDetails', Whoisguard);
  } catch (err) {// ok
  }

  try {
    [{
      content: ExpiredDate
    }] = (0, _.extractTag)('ExpiredDate', Whoisguard);
  } catch (err) {// ok
  }

  return {
    ID: parseInt(ID, 10),
    ...(ExpiredDate ? {
      ExpiredDate
    } : {}),
    ...(EmailDetails ? {
      EmailDetails
    } : {})
  };
};

const parsePremiumDNS = dns => {
  const [{
    content: UseAutoRenew
  }] = (0, _.extractTag)('UseAutoRenew', dns);
  const [{
    content: SubscriptionId
  }] = (0, _.extractTag)('SubscriptionId', dns);
  const [{
    content: CreatedDate
  }] = (0, _.extractTag)('CreatedDate', dns);
  const [{
    content: ExpirationDate
  }] = (0, _.extractTag)('ExpirationDate', dns);
  const [{
    content: IsActive
  }] = (0, _.extractTag)('IsActive', dns);
  return {
    UseAutoRenew: UseAutoRenew == 'true',
    SubscriptionId: parseInt(SubscriptionId),
    CreatedDate: new Date(Date.parse(CreatedDate)),
    ExpirationDate: new Date(Date.parse(ExpirationDate)),
    IsActive: IsActive == true
  };
};

const parse = res => {
  const [{
    content: DomainGetInfoResult,
    props
  }] = (0, _.extractTag)('DomainGetInfoResult', res);
  const [{
    content: DomainDetails
  }] = (0, _.extractTag)('DomainDetails', DomainGetInfoResult);
  const [{
    content: CreatedDate
  }] = (0, _.extractTag)('CreatedDate', DomainDetails);
  const [{
    content: ExpiredDate
  }] = (0, _.extractTag)('ExpiredDate', DomainDetails);
  const [{
    content: NumYears
  }] = (0, _.extractTag)('NumYears', DomainDetails);
  const [{
    content: Whoisguard,
    props: WhoisProps
  }] = (0, _.extractTag)('Whoisguard', DomainGetInfoResult);
  const whois = parseWhois(Whoisguard);
  const [{
    content: PremiumDnsSubscription
  }] = (0, _.extractTag)('PremiumDnsSubscription', DomainGetInfoResult);
  const premiumDns = parsePremiumDNS(PremiumDnsSubscription);
  const [{
    content: DnsDetails,
    props: DnsProps
  }] = (0, _.extractTag)('DnsDetails', DomainGetInfoResult);
  const Nameserver = (0, _.extractTag)('Nameserver', DnsDetails).map(({
    content
  }) => content);
  const [{
    content: Modificationrights,
    props: ModificationrightsProps
  }] = (0, _.extractTag)('Modificationrights', DomainGetInfoResult);
  let rights = {};

  if (Modificationrights) {
    rights = (0, _.extractTag)('Rights', Modificationrights).reduce((acc, {
      props
    }) => {
      const {
        Type
      } = props;
      return { ...acc,
        [Type]: true
      };
    }, {});
  }

  const d = { ...props,
    DomainDetails: {
      CreatedDate,
      ExpiredDate,
      NumYears: parseInt(NumYears)
    },
    Whoisguard: { ...WhoisProps,
      ...whois
    },
    PremiumDnsSubscription: premiumDns,
    DnsDetails: { ...DnsProps,
      Nameserver
    },
    Modificationrights: { ...ModificationrightsProps,
      ...rights
    }
  };
  return d;
};

exports.parse = parse;

async function getInfo(Auth = {}, {
  domain
}) {
  const res = await (0, _query.default)({ ...Auth
  }, COMMAND, {
    DomainName: domain
  });
  const d = parse(res);
  return d;
}
//# sourceMappingURL=get-info.js.map