import query from '../../query'
import { extractTag } from '../..'

const GET_INFO = 'namecheap.domains.getinfo'

/**
 * @param {string} domain a domain name to view info for.
 */
const getInfo = async (domain, Auth = {}) => {
  const res = await query({
    ...Auth,
  }, GET_INFO, { DomainName: domain })

  const [{ content: DomainDetails }] = extractTag('DomainDetails', res)
  const [{ content: Created }] = extractTag('CreatedDate', DomainDetails)
  const [{ content: Expired }] = extractTag('ExpiredDate', DomainDetails)
  const [{ content: Whoisguard, props: WhoisProps }] = extractTag('Whoisguard', res)
  const [{ props: EmailDetails } = {}] = extractTag('EmailDetails', Whoisguard)
  const [{ content: DnsDetails, props: DnsProps }] = extractTag('DnsDetails', res)
  const Nameservers = extractTag('Nameserver', DnsDetails).map(({ content }) => content)
  return {
    Created,
    Expired,
    WhoisEnabled: WhoisProps.Enabled,
    Nameservers,
    EmailDetails,
    DnsProps,
  }
}

export default getInfo
