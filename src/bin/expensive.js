#!/usr/bin/env node
import { debuglog, inspect } from 'util'
import africa from 'africa'
import getUsage from './get-usage'
import List from './commands/list'
import Check from './commands/check'
import Register from './commands/reg'
import getConfig from '../lib/get-config'
import printInfo from '../lib/print/info'
import questions from '../questions'
import handleIp from '../lib/web/handle-ip'
import handleWhitelist from '../lib/web/handle-whitelist'
import Errors from './errors.json'
import { version } from '../../package.json'
import getArgs from './get-args'
import whois from './commands/whois'

const LOG = debuglog('expensive')
const DEBUG = /expensive/.test(process.env.NODE_DEBUG)
const SANDBOX = !!process.env.SANDBOX

const {
  domains: _domains,
  help: _help,
  init: _init,
  version: _version,
  info: _info,
  sort: _sort, // name, expire, create
  desc: _desc,
  filter: _filter,
  type: _type,
  pageSize: _pageSize,
  register: _register,
  free: _free,
  zones: _zones,
  whitelistIP: _whitelistIP,
  whois: _whois,
  Whois: _Whois,
} = getArgs()

if (_version) {
  console.log(version)
  process.exit()
} else if (_help) {
  const u = getUsage()
  console.log(u)
  process.exit()
}

const run = async (name, sandbox) => {
  try {
    // await handleWhitelist(whitelistIP)
    const nc = new Namecheap(Auth)

    if (!domains) {
      await List(nc, { sort, desc, filter, type, pageSize })
      return
    }

    const [domain] = domains

    if (info) {
      const i = await nc.domains.getInfo({ domain })
      printInfo(i)
      return
    }

    if (register) {
      await Register(nc, { domain })
      return
    }

    await Check(nc, {
      domains,
      zones,
      free,
    })
  } catch ({ stack, message, props }) {
    if (props) {
      LOG(inspect(props, { colors: true }))
      LOG(Errors[props.Number])
    }

    const ip = await handleIp({
      message,
      phone,
      user,
      name,
      props,
    })
    if (ip) {
      run(name)
      return
    }

    DEBUG ? LOG(stack) : console.error(message)
    process.exit(1)
  }
}

// const getAppName = () => {
//   const e = `${process.env.SANDBOX ? 'sandbox-' : ''}expensive`
//   return e
// }

const initConfig = async (sandbox) => {
  const n = sandbox ? 'expensive-sandbox' : 'expensive'
  await africa(n, questions, { force: true })
}

(async () => {
  if (_whois || _Whois) return whois(_domains, _Whois)
  if (_init) return initConfig(SANDBOX)
  const Settings = await getConfig(SANDBOX)
  debugger
  // if (_whitelistIP) return whitelistIP(SANDBOX)
  // await run(SANDBOX)
})()