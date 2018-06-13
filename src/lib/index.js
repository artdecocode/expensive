import { c } from 'erte'

export const validateDomains = (arr) => arr.reduce((acc, current) => {
  return acc && typeof current == 'string'
}, true)

export const startupyDomains = [
  '.co',
  '.cc',
  '.io',
  '.bz',
  '.app',
]

export const isSingleWord = d => !/\./.test(d)

export const makeStartupyList = d => startupyDomains.map(s => `${d}${s}`)

const getPropValue = (val) => {
  if (val == 'true') return true
  if (val == 'false') return false
  if (/^\d+$/.test(val)) {
    return parseInt(val, 10)
  }
  return val
}

const propsRe = /(\w+)="(.*?)"/g
const extractProps = (s) => {
  let t
  const r = []
  while((t = propsRe.exec(s)) !== null) {
    const [, key, value] = t
    r.push({
      key,
      value: getPropValue(value),
    })
  }
  return r.reduce((acc, { key, value }) => ({
    ...acc,
    [key]: value,
  }), {})
}


const execRes = (re, s) => {
  const res = re.exec(s)
  if (!res) return res
  const [, ...args] = res
  return args
}

export const extractTag = (tag, string) => {
  // const re = new RegExp(`<${tag}(.*?)/?>(?:([\\s\\S]+?)</${tag}>)?`, 'g')
  const re = new RegExp(`<${tag}( .+)?/?>(?:([\\s\\S]+?)</${tag}>)?`, 'g')
  const r = []

  let t
  while ((t = execRes(re, string)) !== null) {
    if (!t.length) continue
    const [_p = '', _c = ''] = t
    const p = _p.replace(/\/$/, '').trim()
    const props = extractProps(p)
    const item = {
      props,
      content: _c.trim(),
    }
    r.push(item)
  }
  return r
}

const TICK = c('\u2713', 'green')
const CROSS = c('\u2717', 'red')
const DASH = c('-', 'grey')

const day = 24*60*60*1000

export const mapDomains = (domains) => {
  return domains.map(domain => {
    const { Created, Expires, WhoisGuard, IsOurDNS } = domain
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
      Whois: WhoisGuard,
      DNS: IsOurDNS,
    }
  })
}

export const getWhois = (value) => {
  if (value == 'ENABLED') return { value: TICK, length: 1 }
  if (value == 'NOTPRESENT') return { value: DASH, length: 1 }
  return { value, length: value.length }
}

export const heading = (h) => {
  const value = `\x1b[1m${h}\x1b[0m`
  return { value, length: h.length }
}
