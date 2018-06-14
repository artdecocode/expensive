import { validateDomains } from '../../../lib'
import query from '../../../lib/query'
import { extractTag } from '../..'

const COMMAND = 'namecheap.domains.check'

export default async function check(Auth, conf) {
  const {
    domains = [],
    domain,
  } = conf
  if (!Array.isArray(domains)) throw new Error('domains must be a list')
  const val = validateDomains(domains)
  if (!val) throw new Error('all domains must be strings')
  if (domain && typeof domain != 'string') throw new Error('domain must be a string')
  const d = [...domains, ...(domain ? [domain] : [])]

  const res = await query(Auth, COMMAND, { DomainList: d.join(',') })
  const DomainCheckResult = extractTag('DomainCheckResult', res)
  const results = DomainCheckResult.map(({ props }) => props)
  return results
}
