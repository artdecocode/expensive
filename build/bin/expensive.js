#!/usr/bin/env node
const { debuglog, inspect } = require('util');
let NameCheap = require('@rqt/namecheap'); if (NameCheap && NameCheap.__esModule) NameCheap = NameCheap.default;
let NameCheapWeb = require('@rqt/namecheap-web'); if (NameCheapWeb && NameCheapWeb.__esModule) NameCheapWeb = NameCheapWeb.default;
let getUsage = require('./get-usage'); if (getUsage && getUsage.__esModule) getUsage = getUsage.default;
let List = require('./commands/list'); if (List && List.__esModule) List = List.default;
let Check = require('./commands/check'); if (Check && Check.__esModule) Check = Check.default;
let Register = require('./commands/reg'); if (Register && Register.__esModule) Register = Register.default;
let getConfig = require('../lib/get-config'); if (getConfig && getConfig.__esModule) getConfig = getConfig.default;
let whitelistIP = require('../lib/whitelist-ip'); if (whitelistIP && whitelistIP.__esModule) whitelistIP = whitelistIP.default;
let Errors = require('./errors.json'); if (Errors && Errors.__esModule) Errors = Errors.default;
const { version } = require('../../package.json');
let getArgs = require('./get-args'); if (getArgs && getArgs.__esModule) getArgs = getArgs.default;
let whois = require('./commands/whois'); if (whois && whois.__esModule) whois = whois.default;
let initConfig = require('./commands/init'); if (initConfig && initConfig.__esModule) initConfig = initConfig.default;
let Info = require('./commands/info'); if (Info && Info.__esModule) Info = Info.default;
let coupon = require('./commands/coupon'); if (coupon && coupon.__esModule) coupon = coupon.default;

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
  promo: _promo,
  free: _free,
  zones: _zones,
  whitelistIP: _whitelistIP,
  whois: _whois,
  Whois: _Whois,
  sandbox: _sandbox = !!process.env.SANDBOX,
  coupon: _coupon,
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