#!/usr/bin/env node
/* eslint-disable no-console */
import { c } from 'erte'
import { debuglog, inspect } from 'util'
import argufy from 'argufy'
import getUsage from './get-usage'
import { getConfig, checkDomains, getInfo, getList } from '..'
import getPrivateConfig from '../lib/private-config'
import { makeStartupyList, isSingleWord, mapDomains, getWhois, heading } from '../lib'
import handleRequestIP from '../lib/authenticate/handle-request-ip'
import africa from 'africa'
import questions, { privateQuestions } from '../questions'
import { askSingle } from 'reloquent'

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

const printInfo = ({
  Created,
  Expired,
  WhoisEnabled,
  Nameservers,
  EmailDetails,
  DnsProps,
}) => {
  console.log('Created:\t%s', Created)
  console.log('Expires on:\t%s', Expired)
  console.log('Whois enabled:\t%s', WhoisEnabled)
  if (Nameservers) console.log('Nameservers:\t%s', Nameservers.join(', '))
  if (EmailDetails) console.log('Whois email:\t%s', EmailDetails.ForwardedTo)
  if (DnsProps) console.log('DNS:\t\t%s', c(DnsProps.ProviderType, DnsProps.ProviderType == 'FREE' ? 'red' : 'green'))
}

const printList = (ds = []) => {
  if (!ds.length) return
  const replacements = {
    Whois: getWhois,
    DNS(val) {
      if (val) return { value: 'yes', length: 3 }
      return { value: '', length: 0 }
    },
    Years(value) {
      if (value) return { value, length: `${value}`.length }
      return { value: '', length: 0 }
    }
  }
  const domains = mapDomains(ds)
  const [_d] = domains
  // const keys =
  const k = Object.keys(_d).reduce((acc, key) => {
    const { length } = `${key}`
    return {
      ...acc,
      [key]: length, // initialise with titles lengths
    }
  }, {})
  const widths = domains.reduce((dac, d) => {
    const res = Object.keys(d).reduce((acc, key) => {
      const maxLength = dac[key]
      const val = d[key]
      const r = replacements[key]
      const { length } = r ? r(val) : `${val}`
      return {
        ...acc,
        [key]: Math.max(length, maxLength),
      }
    }, {})
    return res
  }, k)
  const keys = ['Name', 'Expiry', 'Years', 'Whois', 'DNS']
  printKeys(keys, keys.reduce((acc, key) => ({ ...acc, [key]: key }), {}), widths, keys.reduce((acc, key) => {
    return {
      ...acc,
      [key]: heading,
    }
  }, {}), {
    Name: true,
  })
  domains.forEach((values) => {
    printKeys(keys, values, widths, replacements, {
      Whois: true,
    })
  })
}

const printKeys = (keys, values, widths, replacements = {}, center = {}) => {
  const k = keys.map(key => {
    const w = widths[key]
    if (!w) throw new Error(`Unknown field ${key}`)
    const v = values[key]
    const r = replacements[key]
    const cen = center[key]
    const p = pad(v, w, r, cen)
    return p
  })
  console.log('%s  '.repeat(keys.length).trim(), ...k)
}

const pad = (val, length, replacement, cen) => {
  if (val === undefined) return ' '.repeat(length)
  let v = val
  let l
  if (replacement) {
    const { value, length: len } = replacement(val)
    v = value
    l = len
  } else {
    l = `${val}`.length
  }
  const p = length - l
  if (cen) {
    const left = Math.floor(p / 2)
    const right = p - left
    const s = ' '.repeat(left) + v + ' '.repeat(right)
    return s
  }
  const s = ' '.repeat(p)
  return `${v}${s}`
}

const runGetList = async (Auth, page) => {
  const { CurrentPage, PageSize, TotalItems, domains } = await getList(Auth, page)
  printList(domains)
  if (CurrentPage * PageSize < TotalItems) {
    const t = `${CurrentPage}/${Math.ceil(TotalItems/PageSize)}`
    const answer = await askSingle({
      text: `Page ${t}. Display more`,
      defaultValue: 'y',
    })
    if (answer == 'y') {
      await runGetList(Auth, CurrentPage + 1)
    }
  }
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

    if (!domain) {
      await runGetList(Auth)
      return
    }

    if (info) {
      const i = await getInfo(domain, Auth)
      printInfo(i)
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
    await africa('expensive-client', privateQuestions, { force: true })
    return
  }
  await run()
})()
