import { c } from 'erte'
import t from 'tablature'

/** @param {!_namecheap.DomainInfo} info */
const printInfo = (info) => {
  const { DomainDetails, Whoisguard, DnsDetails } = info
  const data = [
    { name: 'Created:', value: DomainDetails.CreatedDate },
    { name: 'Expires on:', value: DomainDetails.ExpiredDate },
    { name: 'Whois enabled:', value: Whoisguard.Enabled },
    ...(Whoisguard.EmailDetails ? [{
      name: 'Whois email:', value: Whoisguard.EmailDetails.ForwardedTo,
    }] : []),
    { name: 'DNS:', value: info.DnsDetails.ProviderType == 'FREE' ? c(DnsDetails.ProviderType, 'green') : DnsDetails.ProviderType,
    },
    { name: 'Nameservers:', value: DnsDetails.Nameserver.join(', ') },
    { name: 'Created:', value: DomainDetails.CreatedDate },
  ]
  const res = t({ data, keys: ['name', 'value'] })
  const [, ...rest] = res.split('\n')
  const r = rest.join('\n')
  console.log(r)
}

export default printInfo

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('@rqt/namecheap/types/typedefs/domains').DomainInfo} _namecheap.DomainInfo
 */