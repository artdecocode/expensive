#!/usr/bin/env node
const { debuglog, inspect } = require('util');
let NameCheap = require('@rqt/namecheap'); if (NameCheap && NameCheap.__esModule) NameCheap = NameCheap.default;
let NameCheapWeb = require('@rqt/namecheap-web'); if (NameCheapWeb && NameCheapWeb.__esModule) NameCheapWeb = NameCheapWeb.default;
const getUsage = require('./get-usage');
const List = require('./commands/list');
const Check = require('./commands/check');
const Register = require('./commands/reg');
const getConfig = require('../lib/get-config');
const whitelistIP = require('../lib/whitelist-ip');
const Errors = require('./errors.json');
const { version } = require('../../package.json');
const { _help, _version, _domains, _whitelistIP, _sandbox, _init,
  _info, _register, _promo, _coupon,
  _whois, _Whois, _free, _zones,
  _sort, _desc, _filter, _type, _pageSize } = require('./get-args');
const whois = require('./commands/whois');
const initConfig = require('./commands/init');
const Info = require('./commands/info');
const coupon = require('./commands/coupon');

const LOG = debuglog('expensive')
const DEBUG = /expensive/.test(process.env.NODE_DEBUG)

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
    if (_whitelistIP) return await whitelistIP(Settings, _sandbox)

    const ip = Settings.ClientIp || await NameCheapWeb.LOOKUP_IP()
    const nc = new NameCheap({
      user: Settings.ApiUser,
      key: Settings.ApiKey,
      ip,
      sandbox,
    })

    if (!_domains) return await List(nc, {
      sort: _sort,
      desc: _desc,
      filter: _filter,
      type: _type,
      pageSize: _pageSize,
    })

    const [domain] = _domains

    if (_info) return await Info(nc, domain)
    if (_register) return await Register(nc, {
      domain,
      promo: _promo,
      sandbox,
    })

    await Check(nc, {
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
  try {
    if (_coupon) return await coupon(_sandbox)
    if (_whois || _Whois) return await whois(_domains, _Whois)
    if (_init) return await initConfig(_sandbox)
  } catch (err) {
    return handler(err)
  }
  const Settings = await getConfig(_sandbox)
  await run(Settings, _sandbox)
})()