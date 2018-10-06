import { c } from 'erte'
import t from 'tablature'

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

export default printInfo