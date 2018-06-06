#!/usr/bin/env node
/* eslint-disable no-console */
import { checkDomains, auth } from '..'
import { c } from 'erte'
import getUsage from './get-usage'

import { debuglog } from 'util'
const LOG = debuglog('expensive')
const DEBUG = /expensive/.test(process.env.NODE_DEBUG)

const [,, domain] = process.argv

if (!domain) {
  const u = getUsage()
  console.log(u)
  console.log()
  process.exit(1)
}

const isSingleWord = d => !/\./.test(d)

const startupyDomains = [
  '.co',
  '.cc',
  '.io',
  '.bz',
  '.app',
]

const makeList = d => startupyDomains.map(s => `${d}${s}`)

// const usa = us.reduce((acc, length, i) => {
//   const command = commands[i]
//   const s = pad(command, i)
//   return [...acc, s]
// }, [])

// const findTaken = (free, total) => {
//   const res = total.filter((t) => {
//     const f = free.indexOf(t) < 0
//     return f
//   })
//   return res
// }

;(async () => {
  const single = isSingleWord(domain)
  const domains = single ? makeList(domain) : []
  const d = single ? undefined : domain
  try {
    const a = await auth({
      global: true,
    })
    if (single) {
      console.log('Checking %s domains: %s', domains.length, domains.join(', '))
    } else if (domain) {
      console.log('Checking domain %s', domain)
    }
    const res = await checkDomains({
      ...a,
      domain: d,
      domains,
    })
    if (single) {
      let green = 0
      let red = 0
      domains.forEach(dd => {
        const s = []
        let t
        if (res.indexOf(dd) >= 0) {
          t = c(dd, 'green')
          green++
        } else {
          t = c(dd, 'red')
          red++
        }
        s.push(t)
        console.log('%s', s.join(' '))
      })
      console.log('%s% are free', (green / (green + red)) * 100)
    } else {
      if (res.length) {
        console.log('%s is free', c(domain, 'green'))
      } else {
        console.log('%s is taken', c(domain, 'red'))
      }
    }
  } catch ({ stack, message }) {
    DEBUG ? LOG(stack) : console.error(message)
    process.exit(1)
  }
})()
