import query from '../../../lib/query'

const GET_INFO = 'namecheap.domains.getinfo'

const execRe = (re, s) => {
  const [, arg] = re.exec(s) || []
  return arg
}

/**
 * @typedef {Object} Config
 * @property {string} ApiUser username
 * @property {string} ApiKey api key from the tools
 * @property {string} ClientIp white-listed client ip
 * @property {string} domain a domain name to view info for.
 *
 * @param {Config} config the configuration
 * @returns {string[]} an array with free domains
 */
const getInfo = async (domain, Auth = {}) => {
  const res = await query({
    ...Auth,
  }, GET_INFO, { DomainName: domain })

  const created = execRe(/<CreatedDate>(.+?)<\/CreatedDate>/, res)
  const expired = execRe(/<ExpiredDate>(.+?)<\/ExpiredDate>/, res)
  const whois = execRe(/<Whoisguard Enabled="(True|False)"/, res)
  debugger
  // const re = /DomainCheckResult Domain="(.+?)" Available="(true|false)"/gm
  // let e
  // const results = []
  // while(e = re.exec(res)) { // eslint-disable-line
  //   const [, name, f] = e
  //   const free = f == 'true'
  //   results.push({ name, free })
  // }
  // const f = results.filter(({ free }) => free)
  // const m = f.map(({ name }) => name)
  // return m
}

export default getInfo

// DnsDetails ProviderType="CUSTOM" IsUsingOurDNS="false" HostCount="2" EmailType="FWD" DynamicDNSStatus="false" IsFailover="false"
// Whoisguard Enabled="True"

//
// <CreatedDate>06/05/2018</CreatedDate>
// <ExpiredDate>06/05/2019</ExpiredDate>
