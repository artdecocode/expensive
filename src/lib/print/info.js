import { c } from 'erte'

const printInfo = ({
  Created,
  Expired,
  WhoisEnabled,
  Nameservers,
  EmailDetails,
  DnsProps,
}) => {
  console.log('Created:\t%s', Created)
  console.log('Expires on:\t%s', Expired)
  console.log('Whois enabled:\t%s', WhoisEnabled)
  if (Nameservers) console.log('Nameservers:\t%s', Nameservers.join(', '))
  if (EmailDetails) console.log('Whois email:\t%s', EmailDetails.ForwardedTo)
  if (DnsProps) console.log('DNS:\t\t%s', c(DnsProps.ProviderType, DnsProps.ProviderType == 'FREE' ? 'red' : 'green'))
}

export default printInfo
