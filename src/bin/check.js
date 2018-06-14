import { c } from 'erte'
import { makeStartupyList, isSingleWord } from '../lib'
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
}) {
  const domains = d.reduce((acc, domain) => {
    const singleWord = isSingleWord(domain)
    if (singleWord) return [...acc, ...makeStartupyList(domain)]
    return [...acc, domain]
  }, [])

  console.log('Checking domain%s %s', domains.length > 1 ? 's' : '', domains.join(', '))

  const res = await nc.domains.check({
    domains,
  })
  const data = domains.map((domain) => {
    const found = res.find(({ Domain }) => Domain == domain)
    return found
  })
  const hasPremium = data.some(({ IsPremiumName }) => IsPremiumName)
  const t = tablature({
    keys: ['Domain', 'Available', ...(hasPremium ? ['IsPremiumName', 'PremiumRegistrationPrice'] : [])],
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
        if (!v) return { value: '', length: 0 }
        return { value: c('\u2713', 'green'), length: 1 }
      },
      PremiumRegistrationPrice(value) {
        if (value) return { value, length: value.length }
        return { value: '', length: 0 }
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
