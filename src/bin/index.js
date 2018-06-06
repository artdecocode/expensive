#!/usr/bin/env node
/* eslint-disable no-console */
import { debuglog } from 'util'
import { checkDomains, auth } from '..'
import getUsage from './get-usage'

const LOG = debuglog('expensive')
const DEBUG = /expensive/.test(process.env.NODE_DEBUG)

const [, , d0, d1] = process.argv

const domain = d1 ? d1 : d0

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

;(async () => {
  if (!domain) {
    const u = getUsage()
    console.log(u)
    console.log()
    process.exit(1)
  }
  const single = isSingleWord(domain)
  const domains = single ? makeList(domain) : []
  const d = single ? undefined : domain
  try {
    const a = await auth({
      global: true,
    })
    const res = await checkDomains({
      ...a,
      domain: d,
      domains,
    })
    console.log('The following are free: %s', res.join(', '))
  } catch ({ stack, message }) {
    DEBUG ? LOG(stack) : console.error(message)
    process.exit(1)
  }
})()
