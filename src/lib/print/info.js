import { c } from 'erte'
import { DomainInfo } from '../../Namecheap' // eslint-disable-line

/** @param {DomainInfo} info */
const printInfo = (info) => {
  console.log('Created:\t%s', info.DomainDetails.CreatedDate)
  console.log('Expires on:\t%s', info.DomainDetails.ExpiredDate)
  console.log('Whois enabled:\t%s', info.Whoisguard.Enabled)
  if (info.Whoisguard.EmailDetails) console.log('Whois email:\t%s', info.Whoisguard.EmailDetails.ForwardedTo)
  console.log('DNS:\t\t%s', c(info.DnsDetails.ProviderType, info.DnsDetails.ProviderType == 'FREE' ? 'red' : 'green'))
  console.log('Nameservers:\t%s', info.DnsDetails.Nameserver.join(', '))
}

export default printInfo
