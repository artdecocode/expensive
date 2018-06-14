import { c } from 'erte'
import { makeStartupyList, isSingleWord } from '../lib'
import Namecheap from '../Namecheap' // eslint-disable-line
import tablature from 'tablature'

/** @param {Namecheap} nc */
export default async function check(nc, {
  domain,
}) {
  const singleWord = isSingleWord(domain)
  const domains = singleWord ? makeStartupyList(domain) : []

  if (singleWord) {
    console.log('Checking domains %s', domains.join(', '))
  } else {
    console.log('Checking domain %s', domain)
  }
  const data = await nc.domains.check({
    ...(singleWord ? { domains } : { domain }),
  })
  const t = tablature({
    keys: ['Domain', 'Available'],
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
    },
    centerValues: ['Available'],
  })
  console.log(t)
}
