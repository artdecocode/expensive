import { c } from 'erte'

export const validateDomains = (arr) => arr.reduce((acc, current) => {
  return acc && typeof current == 'string'
}, true)

export const allZones = [
  'com',
  'net',
  'org',
  'biz',
  'co',
  'cc',
  'io',
  'bz',
  'nu',
  'app',
]

export const isSingleWord = d => !/\./.test(d)

export const makeList = (d, zones) => {
  const z = zones.length ? allZones.filter(zone => {
    return zones.includes(zone)
  }) : allZones
  const res = z.map(s => `${d}.${s}`)
  return res
}

const TICK = c('\u2713', 'green')
const CROSS = c('\u2717', 'red')
const DASH = c('-', 'grey')

const day = 24*60*60*1000

export const mapDomains = (domains) => {
  return domains.map(domain => {
    const { Created, Expires, IsOurDNS } = domain
    const cr = Date.parse(Created)
    const e = Date.parse(Expires)
    const t = (new Date).getTime()
    const Expiry = Math.round(Math.abs((e - t) / day))
    const since = Math.round(Math.abs((t - cr) / day))
    const d = t - new Date(cr).getTime()
    const Years = Math.abs(new Date(d).getUTCFullYear() - 1970)
    return {
      ...domain,
      Since: since,
      Expiry,
      Years,
      DNS: IsOurDNS,
    }
  })
}

export const getWhois = (value) => {
  if (value == 'ENABLED') return { value: TICK, length: 1 }
  if (value == 'NOTPRESENT') return { value: DASH, length: 1 }
  return { value, length: value.length }
}

export const getAppName = (sandbox) => {
  const n = sandbox ? 'expensive-sandbox' : 'expensive'
  return n
}