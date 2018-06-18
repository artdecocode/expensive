import { c } from 'erte'
import { makeList, isSingleWord } from '../lib'
import Namecheap from '../Namecheap' // eslint-disable-line
import tablature from 'tablature'
import bosom from 'bosom'
import { homedir } from 'os'
import { resolve } from 'path'
import { existsSync } from 'fs'

const path = resolve(homedir(), '.expensive.log')

/** @param {Namecheap} nc */
export default async function check(nc, {
  domains: d,
  free,
  zones = '',
}) {
  const domains = d
    .reduce((acc, domain) => {
      const singleWord = isSingleWord(domain)
      if (singleWord) {
        const z = zones ? zones.split(',') : []
        const list = makeList(domain, z)
        return [...acc, ...list]
      }
      return [...acc, domain]
    }, [])

  console.log('Checking domain%s %s', domains.length > 1 ? 's' : '', domains.join(', '))

  const res = await nc.domains.check({
    domains,
  })
  const data = domains
    .map((domain) => {
      const found = res.find(({ Domain }) => Domain == domain)
      return found
    })
    .filter(({ Available }) => {
      if (!free) return true
      return Available
    })
  const hasPremium = data.some(({ IsPremiumName }) => IsPremiumName)
  const hasPremiumRegPrice = data.some(({ PremiumRegistrationPrice }) => PremiumRegistrationPrice != '0.0000')
  const t = tablature({
    keys: ['Domain', 'Available',
      ...(hasPremium ? ['IsPremiumName'] : []),
      ...(hasPremiumRegPrice ? ['PremiumRegistrationPrice'] : []),
    ],
    data,
    replacements: {
      Available(v) {
        if (v) {
          return {
            value: c('yes', 'green'),
            length: 3,
          }
        }
        return {
          value: c('no', 'red'),
          length: 2,
        }
      },
      IsPremiumName(v) {
        if (!v) return empty
        return { value: c('\u2713', 'green'), length: 1 }
      },
      PremiumRegistrationPrice(value) {
        if (value == '0.0000') return empty
        if (value) {
          const newValue = value.replace(/(\d+)\.(\d\d)\d\d$/, (match, p1, p2) => `${p1}.${p2}`)
          return {
            value: newValue,
            length: newValue.length,
          }
        }
        return empty
      },
    },
    headings: {
      IsPremiumName: 'Premium',
      PremiumRegistrationPrice: 'Price',
    },
    centerValues: ['Available', 'IsPremiumName'],
  })
  console.log(t)
  await log(d.join(','), data)
}

const log = async (domain, data) => {
  const exists = existsSync(path)
  if (!exists) {
    await bosom(path, [])
  }
  const d = await bosom(path)
  const newData = [
    ...d,
    {
      [domain]: data.filter(({ Available }) => Available).map(({ Domain }) => Domain),
    },
  ]
  await bosom(path, newData, { space: 2 })
}

const empty = {
  value: '',
  length: 0,
}
