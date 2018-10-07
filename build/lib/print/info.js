const { c } = require('erte');
let t = require('tablature'); if (t && t.__esModule) t = t.default;

/** @param {import('@rqt/namecheap/build/api').DomainInfo} info */
const printInfo = (info) => {
  const data = [
    { name: 'Created:', value: info.DomainDetails.CreatedDate },
    { name: 'Expires on:', value: info.DomainDetails.ExpiredDate },
    { name: 'Whois enabled:', value: info.Whoisguard.Enabled },
    ...(info.Whoisguard.EmailDetails ? {
      name: 'Whois email:', value: info.Whoisguard.EmailDetails.ForwardedTo,
    } : {}),
    { name: 'DNS:', value: c(info.DnsDetails.ProviderType,
      info.DnsDetails.ProviderType == 'FREE' ? 'red' : 'green'),
    },
    { name: 'Nameservers:', value: info.DnsDetails.Nameserver.join(', ') },
    { name: 'Created:', value: info.DomainDetails.CreatedDate },
  ]
  const res = t({ data })
  console.log(res)
}

module.exports=printInfo