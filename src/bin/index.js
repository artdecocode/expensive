#!/usr/bin/env node
/* eslint-disable no-console */
import { c } from 'erte'
import { debuglog, inspect } from 'util'
import getUsage from './get-usage'
import { getConfig, checkDomains } from '..'
import { makeStartupyList, isSingleWord } from '../lib'
import authenticate from '../lib/authenticate'
import { askSingle } from 'reloquent'

const LOG = debuglog('expensive')
const DEBUG = /expensive/.test(process.env.NODE_DEBUG)

const [, , domain] = process.argv

if (!domain) {
  const u = getUsage()
  console.log(u)
  console.log()
  process.exit(1)
}

const checkSingleWord = async (word, auth) => {
  const domains = makeStartupyList(word)
  console.log('Checking %s domains: %s', domains.length, domains.join(', '))
  const res = await checkDomains({
    ...auth,
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

const run = async () => {
  const singleWord = isSingleWord(domain)
  let phone
  let user
  try {
    const { DefaultPhone, ...auth } = await getConfig({
      global: true,
    })
    phone = DefaultPhone
    user = auth.ApiUser
    if (singleWord) {
      await checkSingleWord(domain, auth)
      return
    }

    console.log('Checking domain %s', domain)
    const res = await checkDomains({
      ...auth,
      domain,
    })
    if (res.length) {
      console.log('%s is free', c(domain, 'green'))
    } else {
      console.log('%s is taken', c(domain, 'red'))
    }
  } catch ({ stack, message, props }) {
    if (props) {
      LOG(inspect(props, { colors: true }))
      LOG(Errors[props.Number])
    }

    if (props && props.Number == '1011150') {
      const authComplete = await handleRequestIP(message, { phone, user })
      if (authComplete === true) {
        await run()
      } else {
        console.log(authComplete)
      }
      return
    }

    DEBUG ? LOG(stack) : console.error(message)
    process.exit(1)
  }
}

const handleRequestIP = async (message, { phone, user }) => {
  const _ip = /Invalid request IP: (.+)/.exec(message)
  if (!_ip) throw new Error('Could not extract IP from the error message')
  const [, ip] = _ip
  const password = await askSingle({
    text: `Enter password to white-list ${ip}`,
  })
  const res = await authenticate({
    user,
    password,
    ip,
    phone,
  })
  return res
}

const Errors = {
  1011150: 'Parameter RequestIP is invalid',
}

;(async () => {
  await run()
})()
