#!/usr/bin/env node
import { debuglog, inspect } from 'util'
import NameCheap from '@rqt/namecheap'
import getIp from '@rqt/ip'
import getUsage from './get-usage'
import List from './commands/list'
import Check from './commands/check'
import Register from './commands/reg'
import getConfig from '../lib/get-config'
import whitelistIP from '../lib/whitelist-ip'
import Errors from './errors.json'
import { version } from '../../package.json'
import getArgs from './get-args'
import whois from './commands/whois'
import initConfig from './commands/init'
import Info from './commands/info'

const LOG = debuglog('expensive')
const DEBUG = /expensive/.test(process.env.NODE_DEBUG)

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
  sandbox: _sandbox = !!process.env.SANDBOX,
} = getArgs()

if (_version) {
  console.log(version)
  process.exit()
} else if (_help) {
  const u = getUsage()
  console.log(u)
  process.exit()
}

/**
 * @param {import('../lib/get-config').Settings} Settings
 */
const run = async (Settings, sandbox) => {
  try {
    if (_whitelistIP) return whitelistIP(Settings, _sandbox)

    const ip = Settings.ClientIp || await getIp()
    const nc = new NameCheap({
      user: Settings.ApiUser,
      key: Settings.ApiKey,
      ip,
      sandbox,
    })

    if (!_domains) return List(nc, {
      sort: _sort,
      desc: _desc,
      filter: _filter,
      type: _type,
      pageSize: _pageSize,
    })

    const [domain] = _domains

    if (_info) return Info(nc, domain)
    if (_register) return Register(nc, domain)

    return Check(nc, {
      domains: _domains,
      zones: _zones,
      free: _free,
    })
  } catch (error) {
    await handler(error, Settings, sandbox)
  }
}

const handler = async ({ stack, message, props }, Settings, sandbox) => {
  if (props) {
    LOG(inspect(props, { colors: true }))
    LOG(Errors[props.Number])
  }
  if (props && props.Number == 1011150) {
    try {
      const [, ip] = /Invalid request IP: (.+)/.exec(message) || []
      await whitelistIP(Settings, sandbox, ip)
    } catch ({ message: msg, stack: st }) {
      console.log('Could not white-list IP.')
      DEBUG ? LOG(st) : console.error(msg)
      process.exit(1)
    }
    return run(Settings, sandbox)
  }

  DEBUG ? LOG(stack) : console.error(message)
  process.exit(1)
}

(async () => {
  if (_whois || _Whois) return whois(_domains, _Whois)
  if (_init) return initConfig(_sandbox)
  const Settings = await getConfig(_sandbox)
  await run(Settings, _sandbox)
})()