import { c } from 'erte'
import tablature from 'tablature'
import bosom from 'bosom'
import { homedir } from 'os'
import { resolve } from 'path'
import { existsSync } from 'fs'
import { makeList, isSingleWord } from '../../lib'

const path = resolve(homedir(), '.expensive.log')

/** @param {import('@rqt/namecheap')} nc */
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
  const ordered = domains.map((domain) => {
    const found = res.find(({ Domain }) => Domain == domain)
    if (found.PremiumRegistrationPrice) found.PremiumRegistrationPrice = parseFloat(found.PremiumRegistrationPrice)
    return found
  })
  const data = free ? ordered.filter(({ Available }) => Available) : ordered

  const hasPremium = data.some(({ IsPremiumName }) => IsPremiumName)
  const hasPremiumRegPrice = data.some(({ PremiumRegistrationPrice }) =>
    PremiumRegistrationPrice
  )
  const t = tablature({
    keys: ['Domain', 'Available',
      ...(hasPremium ? ['IsPremiumName'] : []),
      ...(hasPremiumRegPrice ? ['PremiumRegistrationPrice'] : []),
    ],
    data: data.map((domain) => {
      return {
        ...domain,
        Available: domain.Available ? c('yes', 'green') : c('no', 'red'),
        IsPremiumName: domain.IsPremiumName ? c('\u2713', 'green') : '',
        PremiumRegistrationPrice: domain.PremiumRegistrationPrice ? parseFloat(domain.PremiumRegistrationPrice).toFixed(2) : '',
      }
    }),
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