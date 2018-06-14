import query from '../../query'
import { extractTag } from '../..'

const COMMAND = 'namecheap.domains.getinfo'

const parseWhois = (Whoisguard) => {
  let ID
  let ExpiredDate
  let EmailDetails
  ([{ content: ID }] = extractTag('ID', Whoisguard))
  try {
    ([{ props: EmailDetails }] = extractTag('EmailDetails', Whoisguard))
  } catch (err) {
    // ok
  }
  try {
    ([{ content: ExpiredDate }] = extractTag('ExpiredDate', Whoisguard))
  } catch (err) {
    // ok
  }
  return {
    ID: parseInt(ID, 10),
    ...(ExpiredDate ? { ExpiredDate } : {}),
    ...(EmailDetails ? { EmailDetails } : {}),
  }
}

const parsePremiumDNS = (dns) => {
  const [{ content: UseAutoRenew }] = extractTag('UseAutoRenew', dns)
  const [{ content: SubscriptionId }] = extractTag('SubscriptionId', dns)
  const [{ content: CreatedDate }] = extractTag('CreatedDate', dns)
  const [{ content: ExpirationDate }] = extractTag('ExpirationDate', dns)
  const [{ content: IsActive }] = extractTag('IsActive', dns)
  return {
    UseAutoRenew: UseAutoRenew == 'true',
    SubscriptionId: parseInt(SubscriptionId),
    CreatedDate: new Date(Date.parse(CreatedDate)),
    ExpirationDate: new Date(Date.parse(ExpirationDate)),
    IsActive: IsActive == true,
  }
}

export const parse = (res) => {
  const [{ content: DomainGetInfoResult, props }] = extractTag('DomainGetInfoResult', res)
  const [{ content: DomainDetails }] = extractTag('DomainDetails', DomainGetInfoResult)
  const [{ content: CreatedDate }] = extractTag('CreatedDate', DomainDetails)
  const [{ content: ExpiredDate }] = extractTag('ExpiredDate', DomainDetails)
  const [{ content: NumYears }] = extractTag('NumYears', DomainDetails)
  const [{ content: Whoisguard, props: WhoisProps }] = extractTag('Whoisguard', DomainGetInfoResult)
  const whois = parseWhois(Whoisguard)

  const [{ content: PremiumDnsSubscription }] = extractTag('PremiumDnsSubscription', DomainGetInfoResult)
  const premiumDns = parsePremiumDNS(PremiumDnsSubscription)

  const [{ content: DnsDetails, props: DnsProps }] = extractTag('DnsDetails', DomainGetInfoResult)
  const Nameserver = extractTag('Nameserver', DnsDetails).map(({ content }) => content)

  const [{ content: Modificationrights, props: ModificationrightsProps }] = extractTag('Modificationrights', DomainGetInfoResult)
  let rights = {}
  if (Modificationrights) {
    rights = extractTag('Rights', Modificationrights).reduce((acc, { props }) => {
      const { Type } = props
      return {
        ...acc,
        [Type]: true,
      }
    }, {})
  }

  const d = {
    ...props,
    DomainDetails: {
      CreatedDate,
      ExpiredDate,
      NumYears: parseInt(NumYears),
    },
    Whoisguard: {
      ...WhoisProps,
      ...whois,
    },
    PremiumDnsSubscription: premiumDns,
    DnsDetails: {
      ...DnsProps,
      Nameserver,
    },
    Modificationrights: {
      ...ModificationrightsProps,
      ...rights,
    },
  }
  return d
}

/**
 * @returns {Result} An object with domain information.
 */
export default async function getInfo(Auth = {}, {
  domain,
}) {
  const res = await query({
    ...Auth,
  }, COMMAND, { DomainName: domain })

  const d = parse(res)
  return d
}
