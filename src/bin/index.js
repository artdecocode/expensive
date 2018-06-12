#!/usr/bin/env node
/* eslint-disable no-console */
import { c } from 'erte'
import { debuglog, inspect } from 'util'
import argufy from 'argufy'
import getUsage from './get-usage'
import { getConfig, checkDomains, getInfo } from '..'
import getPrivateConfig from '../lib/private-config'
import { makeStartupyList, isSingleWord } from '../lib'
import handleRequestIP from '../lib/authenticate/handle-request-ip'
import africa from 'africa'
import questions from '../questions'

const LOG = debuglog('expensive')
const DEBUG = /expensive/.test(process.env.NODE_DEBUG)

const {
  domain,
  help,
  init,
  version,
  head,
  info,
} = argufy({
  domain: {
    command: true,
  },
  version: {
    short: 'v',
    boolean: true,
  },
  help: { short: 'h', boolean: true },
  init: { short: 'I', boolean: true },
  head: { short: 'H', boolean: true },
  info: { short: 'i', boolean: true },
}, process.argv)

if (version) {
  const { version: v } = require('../../package.json')
  console.log(v)
  process.exit()
}

if (help) {
  const u = getUsage()
  console.log(u)
  process.exit()
}

// if (domain) {
//   const u = getUsage()
//   console.log(u)
//   console.log()
//   process.exit(1)
// }

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
    const Auth = await getConfig({
      global: true,
    })
    const { aws_id, aws_key, phone: p } = await getPrivateConfig()
    phone = p
    user = Auth.ApiUser

    if (info) {
      await getInfo(domain, Auth)
      return
    }

    if (singleWord) {
      await checkSingleWord(domain, Auth)
      return
    }

    console.log('Checking domain %s', domain)
    const res = await checkDomains({
      ...Auth,
      domain,
    })
    if (res.length) {
      console.log('%s is free', c(domain, 'green'))
    } else {
      console.log('%s is taken', c(domain, 'red'))
      if (info) {
        console.log('fetching detail about the domain')
      }
    }
  } catch ({ stack, message, props }) {
    if (props) {
      LOG(inspect(props, { colors: true }))
      LOG(Errors[props.Number])
    }

    if (props && props.Number == '1011150') {
      const authComplete = await handleRequestIP(message, { phone, user, head })
      if (authComplete === true) {
        await run()
        // update the configuration to reflect the IP
        // modify `africa` to be able to update the configuration
      } else {
        console.log(authComplete)
      }
      return
    }

    DEBUG ? LOG(stack) : console.error(message)
    process.exit(1)
  }
}

const Errors = {
  1011150: 'Parameter RequestIP is invalid',
  2030166: 'Domain is invalid',
}

; (async () => {
  if (init) {
    await africa('expensive', questions, { force: true })
    return
  }
  await run()
})()
