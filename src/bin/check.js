import { c } from 'erte'
import { checkDomains } from '..'
import { makeStartupyList, isSingleWord } from '../lib'

const checkSingleWord = async (Auth, word) => {
  const domains = makeStartupyList(word)
  console.log('Checking %s domains: %s', domains.length, domains.join(', '))
  const res = await checkDomains({
    ...Auth,
    domains,
  })
  reportFree(domains, res)
}

const reportFree = (domains, freeDomains) => {
  const [free, , total] = domains.reduce(([f, t, tt], dd) => {
    const isFree = freeDomains.some(d => d == dd)

    const it = isFree ? c(dd, 'green') : c(dd, 'red')

    return [
      isFree ? [...f, it] : f,
      isFree ? t : [...t, it],
      [...tt, it],
    ]
  }, [[], [], []])

  const percent = (free.length / total.length) * 100

  console.log('%s', total.join(', '))
  console.log('%s% are free', percent)
}

export default async function check(Auth, {
  domain,
}) {
  const singleWord = isSingleWord(domain)

  if (singleWord) {
    await checkSingleWord(Auth, domain)
    return
  }
  console.log('Checking domain %s', domain)
  const { length } = await checkDomains({
    ...Auth,
    domain,
  })
  if (length) {
    console.log('%s is free', c(domain, 'green'))
  } else {
    console.log('%s is taken', c(domain, 'red'))
  }
}
