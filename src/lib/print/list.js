import { mapDomains, getWhois, heading } from '..'

export default function printList(domains = []) {
  if (!domains.length) {
    console.log('No domains')
    return
  }
  const replacements = {
    Whois: getWhois,
    DNS(val) {
      if (val) return { value: 'yes', length: 3 }
      return { value: '', length: 0 }
    },
    Years(value) {
      if (value) return { value, length: `${value}`.length }
      return { value: '', length: 0 }
    },
  }
  const Domains = mapDomains(domains)
  const [domain] = Domains
  // const keys =
  const k = Object.keys(domain).reduce((acc, key) => {
    const { length } = `${key}`
    return {
      ...acc,
      [key]: length, // initialise with titles lengths
    }
  }, {})
  const widths = Domains.reduce((dac, d) => {
    const res = Object.keys(d).reduce((acc, key) => {
      const maxLength = dac[key]
      const val = d[key]
      const r = replacements[key]
      const { length } = r ? r(val) : `${val}`
      return {
        ...acc,
        [key]: Math.max(length, maxLength),
      }
    }, {})
    return res
  }, k)
  const keys = ['Name', 'Expiry', 'Years', 'Whois', 'DNS']
  printKeys(keys, keys.reduce((acc, key) => ({ ...acc, [key]: key }), {}), widths, keys.reduce((acc, key) => {
    return {
      ...acc,
      [key]: heading,
    }
  }, {}), {
    Name: true,
  })
  Domains.forEach((values) => {
    printKeys(keys, values, widths, replacements, {
      Whois: true,
    })
  })
}

const printKeys = (keys, values, widths, replacements = {}, center = {}) => {
  const k = keys.map(key => {
    const w = widths[key]
    if (!w) throw new Error(`Unknown field ${key}`)
    const v = values[key]
    const r = replacements[key]
    const cen = center[key]
    const p = pad(v, w, r, cen)
    return p
  })
  console.log('%s  '.repeat(keys.length).trim(), ...k)
}


const pad = (val, length, replacement, cen) => {
  if (val === undefined) return ' '.repeat(length)
  let v = val
  let l
  if (replacement) {
    const { value, length: len } = replacement(val)
    v = value
    l = len
  } else {
    l = `${val}`.length
  }
  const p = length - l
  if (cen) {
    const left = Math.floor(p / 2)
    const right = p - left
    const s = ' '.repeat(left) + v + ' '.repeat(right)
    return s
  }
  const s = ' '.repeat(p)
  return `${v}${s}`
}
