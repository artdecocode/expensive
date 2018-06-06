#!/usr/bin/env node
/* eslint-disable no-console */
import { c } from 'erte'
import { debuglog, inspect } from 'util'
import getUsage from './get-usage'
import { getConfig, checkDomains } from '..'
import { makeStartupyList, isSingleWord } from '../lib'
import authenticate from '../lib/authenticate'
import { askQuestions } from 'reloquent'

const LOG = debuglog('expensive')
const DEBUG = /expensive/.test(process.env.NODE_DEBUG)

const [,, domain] = process.argv

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
  const [free,, total] = domains.reduce(([f, t, tt], dd) => {
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

(async () => {
  const singleWord = isSingleWord(domain)

  try {
    const auth = await getConfig({
      global: true,
    })
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
      if (props.Number == '1011150') {
        // attempt to authenticate
        const answer = await askQuestions({
          q: {
            text: 'IP is not whitelisted. Authenticate and whitelist the IP (y/n)?',
            async getDefault() {
              return 'y'
            },
          },
        }, null, 'q')
        if (answer.trim() == 'y') {
          console.log('ok will sing in')
          const res = await authenticate()
          debugger
          return
        }
      }
    }
    DEBUG ? LOG(stack) : console.error(message)
    process.exit(1)
  }
})()

const Errors = {
  1011150: 'Parameter RequestIP is invalid',
}
