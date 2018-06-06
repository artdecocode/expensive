import { validateDomains } from '../../../lib'
import query from '../../../lib/query'

const DOMAINS_CHECK = 'namecheap.domains.check'

/**
 * @typedef {Object} Config
 * @property {string} ApiUser username
 * @property {string} ApiKey api key from the tools
 * @property {string} ClientIp white-listed client ip
 * @property {string[]} [domains] a list of domains to check
 * @property {string} domain a single domain to check.
 *
 * @param {Config} config the configuration
 * @returns {string[]} an array with free domains
 */
const checkDomains = async (config) => {
  const {
    ApiUser,
    ApiKey,
    ClientIp,
    domains = [],
    domain,
  } = config
  if (!Array.isArray(domains)) throw new Error('domains must be a list')
  const val = validateDomains(domains)
  if (!val) throw new Error('all domains must be strings')
  if (domain && typeof domain != 'string') throw new Error('domain must be a string')
  const d = [...domains, ...(domain ? [domain] : [])]


  const res = await query({
    ApiUser, ApiKey, ClientIp,
  }, DOMAINS_CHECK, { DomainList: d.join(',') })

  const re = /DomainCheckResult Domain="(.+?)" Available="(true|false)"/gm
  let e
  const results = []
  while(e = re.exec(res)) { // eslint-disable-line
    const [, name, f] = e
    const free = f == 'true'
    results.push({ name, free })
  }
  const f = results.filter(({ free }) => free)
  const m = f.map(({ name }) => name)
  return m
}

export default checkDomains
